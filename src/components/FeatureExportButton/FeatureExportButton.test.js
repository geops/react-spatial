import "jest-canvas-mock";
import { fireEvent, render } from "@testing-library/react";
import Feature from "ol/Feature";
import GPX from "ol/format/GPX";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import React from "react";

import FeatureExportButton from ".";

const layer = new VectorLayer({
  name: "Sample layer",
  source: new VectorSource({
    features: [
      new Feature({
        geometry: new Point([819103.972418, 6120013.078324]),
      }),
    ],
  }),
});

describe("FeatureExportButton", () => {
  describe("should match snapshot", () => {
    test("with default attributes.", () => {
      const { container } = render(<FeatureExportButton layer={layer} />);
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("should match snapshot with cutom attributes.", () => {
      const { container } = render(
        <FeatureExportButton
          className="foo"
          layer={layer}
          // eslint-disable-next-line jsx-a11y/tabindex-no-positive
          tabIndex={2}
          title="bar"
        />,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("should match snapshot with children passed.", () => {
      const { container } = render(
        <FeatureExportButton layer={layer}>
          <div>Foo</div>
        </FeatureExportButton>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("triggers onClick", () => {
    // Use library 'jest-environment-jsdom-fourteen'
    // to allow jest test of format.writeFeatures(feats).
    const renderLayer = (featNumbers) => {
      const featsArray = [];
      for (let i = 0; i < featNumbers; i += 1) {
        featsArray.push(
          new Feature({
            geometry: new Point([819103.972418, 6120013.078324]),
          }),
        );
      }

      return new VectorLayer({
        name: "ExportLayer",
        source: new VectorSource({
          features: featsArray,
        }),
      });
    };

    const iconLayer = renderLayer(1);

    const textStyle = new Style({
      text: new Text({
        font: "normal 16px Helvetica",
        stroke: new Stroke({
          color: [255, 255, 255, 1],
          width: 3,
        }),
        text: "text name",
      }),
    });

    test("should be trigger click function.", () => {
      const { container } = render(<FeatureExportButton layer={iconLayer} />);
      const spy = jest.spyOn(FeatureExportButton, "exportFeatures");
      fireEvent.click(container.querySelector(".rs-feature-export-button"));
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should use attributes for parsing", () => {
      const { container } = render(
        <FeatureExportButton
          format={GPX}
          layer={iconLayer}
          projection="EPSG:4326"
        />,
      );
      const spy = jest.spyOn(FeatureExportButton, "exportFeatures");
      fireEvent.click(container.querySelector(".rs-feature-export-button"));
      expect(spy).toHaveBeenCalledWith(iconLayer, "EPSG:4326", GPX);
    });

    describe("#createFeatureString()", () => {
      describe("using KMLFormat", () => {
        test("should export kml by default.", () => {
          const exportString = FeatureExportButton.createFeatureString(
            iconLayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );
          expect(exportString).toMatchSnapshot();
        });

        const iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: "https://openlayers.org/en/latest/examples/data/icon.png",
          }),
        });

        iconLayer.getSource().forEachFeature((f) => {
          f.setStyle(iconStyle);
        });

        test("should export icon style in kml.", () => {
          const exportString = FeatureExportButton.createFeatureString(
            iconLayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );
          const expectedString =
            "<Style><IconStyle><scale>2</scale><Icon><href>" +
            "https://openlayers.org/en/latest/examples/data/icon.png" +
            "</href></Icon></IconStyle></Style>";
          expect(exportString.match(/<Style>(.*?)<\/Style>/g)[0]).toBe(
            expectedString,
          );
        });

        test("should export with layer name.", () => {
          const namedlayer = renderLayer(1);
          const exportString = FeatureExportButton.createFeatureString(
            namedlayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );
          const expectedname = "<name>ExportLayer</name>";
          expect(exportString.match(/<name>(.*?)<\/name>/g)[0]).toBe(
            expectedname,
          );
        });

        test("should export without layer name.", () => {
          const unnamedlayer = renderLayer(1);
          const exportString = FeatureExportButton.createFeatureString(
            unnamedlayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );
          expect(
            /<document><name>ExportLayer<\/name>/g.test(exportString),
          ).toBe(false);
        });

        test("should export text style in kml.", () => {
          const textlayer = renderLayer(2);

          textlayer.getSource().forEachFeature((f) => {
            f.setStyle(textStyle);
          });
          const exportString = FeatureExportButton.createFeatureString(
            textlayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );
          const expectedStyle =
            "<Style><IconStyle><scale>0</scale></IconStyle>" +
            "<LabelStyle><color>ff333333</color></LabelStyle></Style>";
          expect(exportString.match(/<Style>(.*?)<\/Style>/g)[0]).toBe(
            expectedStyle,
          );
        });

        test("should only export none-empty text style in kml.", () => {
          const textlayer = renderLayer(2);

          textlayer.getSource().forEachFeature((f) => {
            f.setStyle(textStyle);
          });
          const exportString1 = FeatureExportButton.createFeatureString(
            textlayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );

          expect(
            exportString1.match(/<Placemark>(.*?)<\/Placemark>/g).length,
          ).toBe(2);

          const newStyle = new Style({
            text: new Text({
              font: "normal 16px Helvetica",
              stroke: new Stroke({
                color: [255, 255, 255, 1],
                width: 3,
              }),
              text: "",
            }),
          });
          // Set empty string as name for first feature
          textlayer.getSource().getFeatures()[0].setStyle(newStyle);

          const exportString2 = FeatureExportButton.createFeatureString(
            textlayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );

          expect(
            exportString2.match(/<Placemark>(.*?)<\/Placemark>/g).length,
          ).toBe(1);
        });

        test("should export extended data.", () => {
          const extendedLayer = renderLayer(1);

          const style = new Style({
            stroke: new Stroke({
              color: [0, 0, 0, 1],
              lineDash: [40, 40],
            }),
            text: new Text({
              backgroundFill: new Fill({
                color: "rgba(255,255,255,0.01)",
              }),
              font: "normal 18px Arial",
              rotation: 0.5,
              text: "text name",
            }),
          });

          extendedLayer.getSource().forEachFeature((f) => {
            f.setStyle(style);
          });
          const exportString = FeatureExportButton.createFeatureString(
            extendedLayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );
          const expectedStyle =
            '<ExtendedData><Data name="lineDash"><value>40,40</value></Data>' +
            '<Data name="textBackgroundFillColor"><value>rgba(255,255,255,0.01)</value></Data>' +
            '<Data name="textFont"><value>normal 18px Arial</value></Data>' +
            '<Data name="textRotation"><value>0.5</value></Data></ExtendedData>';
          expect(
            exportString.match(/<ExtendedData>(.*?)<\/ExtendedData>/g)[0],
          ).toBe(expectedStyle);
        });

        test("should not export others extended data than style.", () => {
          const extendedLayer = renderLayer(1);

          const style = new Style({
            stroke: new Stroke({
              color: [0, 0, 0, 1],
              lineDash: [40, 40],
            }),
            text: new Text({
              backgroundFill: new Fill({
                color: "rgba(255,255,255,0.01)",
              }),
              font: "normal 18px Arial",
              rotation: 0.5,
              text: "text name",
            }),
          });

          extendedLayer.getSource().forEachFeature((f) => {
            f.setStyle(style);
            f.set("foo", "bar");
          });
          const exportString = FeatureExportButton.createFeatureString(
            extendedLayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );
          const expectedStyle =
            '<ExtendedData><Data name="lineDash"><value>40,40</value></Data>' +
            '<Data name="textBackgroundFillColor"><value>rgba(255,255,255,0.01)</value></Data>' +
            '<Data name="textFont"><value>normal 18px Arial</value></Data>' +
            '<Data name="textRotation"><value>0.5</value></Data></ExtendedData>';
          expect(
            exportString.match(/<ExtendedData>(.*?)<\/ExtendedData>/g)[0],
          ).toBe(expectedStyle);
        });

        test("should export lineStartIcon and lineEndIcon style.", () => {
          const extendedLayer = renderLayer(1);
          const line = new Feature({
            geometry: new LineString([
              [0, 1],
              [2, 3],
              [4, 5],
            ]),
          });
          extendedLayer.getSource().addFeatures([line]);

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
                src: "fooarrowend.png",
              }),
            }),
            new Style({
              geometry: () => {
                return new Point([0, 1]);
              },
              image: new Icon({
                src: "fooarrowstart.png",
              }),
            }),
          ];
          line.setStyle(style);

          const exportString = FeatureExportButton.createFeatureString(
            extendedLayer,
            FeatureExportButton.defaultProps.projection,
            FeatureExportButton.defaultProps.format,
          );
          const expectedStyle =
            '<ExtendedData><Data name="lineDash"><value>40,40</value></Data>' +
            '<Data name="lineEndIcon">' +
            '<value>{"scale":1,"size":null,"url":"fooarrowend.png"}</value></Data>' +
            '<Data name="lineStartIcon">' +
            '<value>{"scale":1,"size":null,"url":"fooarrowstart.png"}</value></Data>' +
            "</ExtendedData>";

          expect(
            exportString.match(/<ExtendedData>(.*?)<\/ExtendedData>/g)[0],
          ).toBe(expectedStyle);
        });
      });
    });
  });
});
