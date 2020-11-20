import { configure } from 'enzyme';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { get } from 'ol/proj';
import Adapter from 'enzyme-adapter-react-16';
import beautify from 'xml-beautifier';
import KML from './KML';

configure({ adapter: new Adapter() });
const xmlns =
  'xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd"';

const expectWriteResult = (feats, str) => {
  expect(
    beautify(
      KML.writeFeatures(
        {
          name: 'lala',
          olLayer: new VectorLayer({
            source: new VectorSource({
              features: feats,
            }),
          }),
        },
        get('EPSG:4326'),
      ),
    ),
  ).toEqual(beautify(str));
};

describe('KML', () => {
  describe('readFeatures() and writeFeatures()', () => {
    test('should read/write LineStyle and ExtendedData (linesDash, lineStartIcon and lineEndIcon).', () => {
      const str = `
        <kml ${xmlns}>
          <Document>
            <name>lala</name>
            <Placemark>
                <Style>
                  <LineStyle>
                    <color>ff056600</color>
                    <width>1</width>
                  </LineStyle>
                </Style>
                <ExtendedData>
                  <Data name="lineDash"><value>40,40</value></Data>
                  <Data name="lineEndIcon"><value>{"url":"fooarrowend.png","scale":0.35,"size":[36,58]}</value></Data>
                  <Data name="lineStartIcon"><value>{"url":"fooarrowstart.png","scale":0.35,"size":[36,58]}</value></Data>
                </ExtendedData>
                <LineString><coordinates>0,1,0 3,5,0 40,25,0</coordinates></LineString>
            </Placemark>
          </Document>
        </kml>
      `;
      const feats = KML.readFeatures(str);
      const styles = feats[0].getStyle();
      expect(feats.length).toBe(1);
      expect(styles.length).toBe(3);

      // line stroke
      const strokeStyle = styles[0].getStroke();
      expect(strokeStyle.getColor()).toEqual([0, 102, 5, 1]);
      expect(strokeStyle.getLineDash()).toEqual([40, 40]);

      // line start icon
      const lineStartStyle = styles[1];
      expect(lineStartStyle.getImage().getRotation()).toEqual(
        -0.9272952180016122,
      );
      expect(lineStartStyle.getImage().getColor()).toEqual([0, 102, 5, 1]);
      expect(lineStartStyle.getImage().getRotateWithView()).toBe(true);
      expect(lineStartStyle.getGeometry()(feats[0]).getCoordinates()).toEqual([
        0,
        1,
        0,
      ]);

      // line end icon
      const lineEndStyle = styles[2];
      expect(lineEndStyle.getImage().getRotation()).toEqual(
        -0.49555167348582857,
      );
      expect(lineEndStyle.getImage().getRotateWithView()).toBe(true);
      expect(lineEndStyle.getImage().getColor()).toEqual([0, 102, 5, 1]);
      expect(lineEndStyle.getGeometry()(feats[0]).getCoordinates()).toEqual([
        40,
        25,
        0,
      ]);

      expectWriteResult(feats, str);
    });

    test('should read/write TextStyle and ExtendedData.', () => {
      const str = `
        <kml ${xmlns}>
          <Document>
            <name>lala</name>
            <Placemark>
              <name>   bar  </name>
              <Style>
                <IconStyle>
                  <scale>0</scale>
                </IconStyle>
                <LabelStyle>
                  <color>ff7e3420</color>
                  <scale>2</scale>
                </LabelStyle>
              </Style>
              <ExtendedData>
                <Data name="textAlign">
                  <value>right</value>
                </Data>
                <Data name="textBackgroundFillColor">
                  <value>rgba(255,255,255,0.01)</value>
                </Data>
                <Data name="textFont">
                  <value>bold 16px arial</value>
                </Data>
                <Data name="textOffsetX">
                  <value>-90</value>
                </Data>
                <Data name="textOffsetY">
                  <value>30</value>
                </Data>
                <Data name="textPadding">
                  <value>5,6,7,8</value>
                </Data>
                <Data name="textRotation">
                  <value>2.303834612632515</value>
                </Data>
              </ExtendedData>
              <Point>
                <coordinates>0,0,0</coordinates>
              </Point>
            </Placemark>
          </Document>
        </kml>
      `;
      const feats = KML.readFeatures(str);
      const styles = feats[0].getStyle();
      expect(feats.length).toBe(1);
      expect(styles.length).toBe(1);

      // Text
      const style = styles[0].getText();
      expect(style.getText()).toBe('bar'); // spaces are trimmed.
      expect(style.getFont()).toEqual('bold 16px arial');
      expect(style.getFill()).toEqual({ color_: [32, 52, 126, 1] });
      expect(style.getStroke()).toEqual(null);
      expect(style.getScale()).toEqual(2);
      expect(style.getRotation()).toEqual('2.303834612632515');
      expect(style.getPadding()).toEqual([5, 6, 7, 8]);
      expect(style.getBackgroundFill()).toEqual({
        color_: 'rgba(255,255,255,0.01)',
      });
      expect(style.getTextAlign()).toEqual('right');
      expect(style.getOffsetX()).toEqual(-90);
      expect(style.getOffsetY()).toEqual(30);
      expectWriteResult(feats, str);
    });

    test.only('should read and write lineDash and fillPattern style for polygon', () => {
      const str = `
        <kml ${xmlns}>
          <Document>
            <name>lala</name>
            <Placemark>
                <description></description>
                <Style>
                    <LineStyle>
                        <color>ff0000eb</color>
                        <width>2</width>
                    </LineStyle>
                    <PolyStyle>
                      <fill>0</fill>
                    </PolyStyle>
                </Style>
                <ExtendedData>
                    <Data name="fillPattern">
                        <value>{"id":3,"color":[235,0,0,1]}</value>
                    </Data>
                    <Data name="lineDash">
                        <value>1,1</value>
                    </Data>
                </ExtendedData>
                <Polygon>
                    <outerBoundaryIs>
                        <LinearRing>
                            <coordinates>8.521,47.381,0 8.529,47.375,0 8.531,47.382,0 8.521,47.381,0</coordinates>
                        </LinearRing>
                    </outerBoundaryIs>
                </Polygon>
            </Placemark>
        </Document>
      </kml>
      `;
      const feats = KML.readFeatures(str);
      const styles = feats[0].getStyle();
      expect(feats.length).toBe(1);
      expect(styles.length).toBe(1);

      // Polygon
      const feature = feats[0];
      const outlineStyle = styles[0].getStroke();
      expect(outlineStyle.getColor()).toEqual([235, 0, 0, 1]);
      expect(outlineStyle.getWidth()).toEqual(2);
      const fillStyle = styles[0].getFill();
      expect(feature.get('fillPattern')).toEqual({
        id: 3,
        color: [235, 0, 0, 1],
      });
      const color = fillStyle.getColor();
      expect(color.canvas).toMatchSnapshot();
      expect(color.id).toBe(3);
      expect(color.color).toEqual([235, 0, 0, 1]);
      expectWriteResult(feats, str);
    });

    test('should add zIndex and rotation to icon style and zoomAtMaxIconSize to feature properties.', () => {
      const str = `
      <kml ${xmlns}>
        <Document>
            <name>lala</name>
            <Placemark>
                <description></description>
                <Style>
                    <IconStyle>
                        <scale>0.5</scale>
                        <heading>
                          1.5707963267948966
                        </heading>
                        <Icon>
                            <href>https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
                            <gx:w>64</gx:w>
                            <gx:h>64</gx:h>
                        </Icon>
                        <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                    </IconStyle>
                </Style>
                <ExtendedData>
                    <Data name="iconRotation">
                      <value>1.5707963267948966</value>
                    </Data>
                    <Data name="zIndex">
                        <value>1</value>
                    </Data>
                    <Data name="zoomAtMaxIconSize">
                      <value>12.65397</value>
                    </Data>
                </ExtendedData>
                <Point>
                    <coordinates>0,0,0</coordinates>
                </Point>
            </Placemark>
        </Document>
      </kml>
      `;
      const feats = KML.readFeatures(str);
      const style = feats[0].getStyle()[0];
      expect(style.getZIndex()).toBe(1);
      expect(style.getImage().getRotation()).toBe(1.5707963267948966);
      expect(feats[0].get('zoomAtMaxIconSize')).toBe(12.65397);
      expectWriteResult(feats, str);
    });
  });
});
