import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TiImage } from 'react-icons/ti';
import GPX from 'ol/format/GPX';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/geom/Circle';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import Layer from '../../layers/Layer';

import FeatureExportButton from '.';

configure({ adapter: new Adapter() });

describe('FeatureExportButton', () => {
  const layer = new Layer({
    name: 'Sample layer',
    olLayer: new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Point([819103.972418, 6120013.078324]),
          }),
        ],
      }),
    }),
  });

  test('should match snapshot.', () => {
    const component = renderer.create(
      <FeatureExportButton
        title="FeatureExport"
        layer={layer}
        className="tm-feature-export-example"
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with children passed.', () => {
    const component = renderer.create(
      <FeatureExportButton layer={layer}>
        <TiImage />
      </FeatureExportButton>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('triggers onClick', () => {
    // Use library 'jest-environment-jsdom-fourteen'
    // to allow jest test of format.writeFeatures(feats).
    const renderLayer = featNumbers => {
      const featsArray = [];
      for (let i = 0; i < featNumbers; i += 1) {
        featsArray.push(
          new Feature({
            geometry: new Point([819103.972418, 6120013.078324]),
          }),
        );
      }

      return new Layer({
        name: 'ExportLayer',
        olLayer: new VectorLayer({
          source: new VectorSource({
            features: featsArray,
          }),
        }),
      });
    };

    const iconLayer = renderLayer(1);

    const textStyle = new Style({
      text: new Text({
        text: 'text name',
        font: 'normal 16px Helvetica',
        stroke: new Stroke({
          color: [255, 255, 255, 1],
          width: 3,
        }),
      }),
    });

    test('should be trigger click function.', () => {
      const wrapper = shallow(<FeatureExportButton layer={iconLayer} />);
      const spy = jest.spyOn(FeatureExportButton.prototype, 'exportFeatures');

      wrapper.find('.tm-feature-export').simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('should export kml by default.', () => {
      const wrapper = mount(<FeatureExportButton layer={iconLayer} />);
      const exportString = wrapper.instance().createFeatureString(iconLayer);
      expect(exportString).toMatchSnapshot();
    });

    test('should export gpx format.', () => {
      const wrapper = mount(
        <FeatureExportButton format={GPX} layer={iconLayer} />,
      );
      const exportString = wrapper.instance().createFeatureString(iconLayer);
      expect(exportString).toMatchSnapshot();
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      }),
    });

    iconLayer.olLayer.getSource().forEachFeature(f => {
      f.setStyle(iconStyle);
    });

    test('should export icon style in kml.', () => {
      const wrapper = mount(<FeatureExportButton layer={iconLayer} />);
      const exportString = wrapper.instance().createFeatureString(iconLayer);
      const expectedString =
        '<Style><IconStyle><Icon><href>' +
        'https://openlayers.org/en/latest/examples/data/icon.png' +
        '</href></Icon></IconStyle></Style>';
      expect(exportString.match(/<Style>(.*?)<\/Style>/g)[0]).toBe(
        expectedString,
      );
    });

    test('should export with layer name.', () => {
      const namedlayer = renderLayer(1);
      const wrapper = mount(<FeatureExportButton layer={namedlayer} />);
      const exportString = wrapper.instance().createFeatureString(namedlayer);
      const expectedname = '<name>ExportLayer</name>';
      expect(exportString.match(/<name>(.*?)<\/name>/g)[0]).toBe(expectedname);
    });

    test('should export without layer name.', () => {
      const unnamedlayer = renderLayer(1);
      delete unnamedlayer.name;
      const wrapper = mount(<FeatureExportButton layer={unnamedlayer} />);
      const exportString = wrapper.instance().createFeatureString(unnamedlayer);
      expect(/<document><name>ExportLayer<\/name>/g.test(exportString)).toBe(
        false,
      );
    });

    test('should export text style in kml.', () => {
      const textlayer = renderLayer(2);

      textlayer.olLayer.getSource().forEachFeature(f => {
        f.setStyle(textStyle);
      });

      const wrapper = mount(<FeatureExportButton layer={textlayer} />);
      const exportString = wrapper.instance().createFeatureString(textlayer);
      const expectedStyle =
        '<Style><IconStyle><scale>0</scale></IconStyle>' +
        '<LabelStyle><color>ff333333</color></LabelStyle></Style>';
      expect(exportString.match(/<Style>(.*?)<\/Style>/g)[0]).toBe(
        expectedStyle,
      );
    });

    test('should only export none-empty text style in kml.', () => {
      const textlayer = renderLayer(2);

      textlayer.olLayer.getSource().forEachFeature(f => {
        f.setStyle(textStyle);
      });

      const wrapper = mount(<FeatureExportButton layer={textlayer} />);
      const exportString1 = wrapper.instance().createFeatureString(textlayer);

      expect(exportString1.match(/<Placemark>(.*?)<\/Placemark>/g).length).toBe(
        2,
      );

      const newStyle = new Style({
        text: new Text({
          text: '',
          font: 'normal 16px Helvetica',
          stroke: new Stroke({
            color: [255, 255, 255, 1],
            width: 3,
          }),
        }),
      });
      // Set empty string as name for first feature
      textlayer.olLayer
        .getSource()
        .getFeatures()[0]
        .setStyle(newStyle);

      const exportString2 = wrapper.instance().createFeatureString(textlayer);

      expect(exportString2.match(/<Placemark>(.*?)<\/Placemark>/g).length).toBe(
        1,
      );
    });

    test("should not export 'Cirle geom' (kml unsupported).", () => {
      const circleLayer = new Layer({
        name: 'ExportLayer',
        olLayer: new VectorLayer({
          source: new VectorSource({
            features: [
              new Feature({
                geometry: new Circle({
                  center: [843119.531243, 6111943.000197],
                  radius: 1000,
                }),
              }),
            ],
          }),
        }),
      });

      const circleStyle = new Style({
        stroke: new Stroke({
          color: 'red',
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.1)',
        }),
      });

      circleLayer.olLayer.getSource().forEachFeature(f => {
        f.setStyle(circleStyle);
      });

      const wrapper = mount(<FeatureExportButton layer={circleLayer} />);
      const exportString = wrapper.instance().createFeatureString(circleLayer);
      expect(exportString).toBe(undefined);
    });

    test('should export extended data.', () => {
      const extendedLayer = renderLayer(1);

      const style = new Style({
        stroke: new Stroke({
          color: [0, 0, 0, 1],
          lineDash: [40, 40],
        }),
        text: new Text({
          text: 'text name',
          font: 'normal 18px Arial',
          rotation: 0.5,
          backgroundFill: new Fill({
            color: 'rgba(255,255,255,0.01)',
          }),
        }),
      });

      extendedLayer.olLayer.getSource().forEachFeature(f => {
        f.setStyle(style);
      });

      const wrapper = mount(<FeatureExportButton layer={extendedLayer} />);
      const exportString = wrapper
        .instance()
        .createFeatureString(extendedLayer);
      const expectedStyle =
        '<ExtendedData><Data name="lineDash"><value>40,40</value></Data>' +
        '<Data name="textBackgroundFillColor"><value>rgba(255,255,255,0.01)</value></Data>' +
        '<Data name="textFont"><value>normal 18px Arial</value></Data>' +
        '<Data name="textRotation"><value>0.5</value></Data></ExtendedData>';
      expect(
        exportString.match(/<ExtendedData>(.*?)<\/ExtendedData>/g)[0],
      ).toBe(expectedStyle);
    });

    test('should not export others extended data than style.', () => {
      const extendedLayer = renderLayer(1);

      const style = new Style({
        stroke: new Stroke({
          color: [0, 0, 0, 1],
          lineDash: [40, 40],
        }),
        text: new Text({
          text: 'text name',
          font: 'normal 18px Arial',
          rotation: 0.5,
          backgroundFill: new Fill({
            color: 'rgba(255,255,255,0.01)',
          }),
        }),
      });

      extendedLayer.olLayer.getSource().forEachFeature(f => {
        f.setStyle(style);
        f.set('foo', 'bar');
      });

      const wrapper = mount(<FeatureExportButton layer={extendedLayer} />);
      const exportString = wrapper
        .instance()
        .createFeatureString(extendedLayer);
      const expectedStyle =
        '<ExtendedData><Data name="lineDash"><value>40,40</value></Data>' +
        '<Data name="textBackgroundFillColor"><value>rgba(255,255,255,0.01)</value></Data>' +
        '<Data name="textFont"><value>normal 18px Arial</value></Data>' +
        '<Data name="textRotation"><value>0.5</value></Data></ExtendedData>';
      expect(
        exportString.match(/<ExtendedData>(.*?)<\/ExtendedData>/g)[0],
      ).toBe(expectedStyle);
    });

    test('should export lineStartIcon and lineEndIcon style.', () => {
      const extendedLayer = renderLayer(1);
      const line = new Feature({
        geometry: new LineString([
          [0, 1],
          [2, 3],
          [4, 5],
        ]),
      });
      extendedLayer.olLayer.getSource().addFeatures([line]);

      const style = [
        new Style({
          stroke: new Stroke({
            color: [0, 0, 0, 1],
            lineDash: [40, 40],
          }),
        }),
        new Style({
          geometry: () => {
            return new Point([4, 5]);
          },
          image: new Icon({
            src: 'fooarrowend.png',
          }),
        }),
        new Style({
          geometry: () => {
            return new Point([0, 1]);
          },
          image: new Icon({
            src: 'fooarrowstart.png',
          }),
        }),
      ];
      line.setStyle(style);

      const wrapper = mount(<FeatureExportButton layer={extendedLayer} />);
      const exportString = wrapper
        .instance()
        .createFeatureString(extendedLayer);
      const expectedStyle =
        '<ExtendedData><Data name="lineDash"><value>40,40</value></Data>' +
        '<Data name="lineEndIcon">' +
        '<value>{"url":"fooarrowend.png","scale":1,"size":null}</value></Data>' +
        '<Data name="lineStartIcon">' +
        '<value>{"url":"fooarrowstart.png","scale":1,"size":null}</value></Data>' +
        '</ExtendedData>';

      expect(
        exportString.match(/<ExtendedData>(.*?)<\/ExtendedData>/g)[0],
      ).toBe(expectedStyle);
    });
  });
});
