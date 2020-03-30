import 'jest-canvas-mock';
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
          getName: () => 'lala',
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
  describe('#read/writeFeatures()', () => {
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
                  <PolyStyle>
                    <color>ffffffff</color>
                  </PolyStyle>
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
              <name>\u200B   bar  \u200B</name>
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
                <Data name="textBackgroundFillColor">
                  <value>rgba(255,255,255,0.01)</value>
                </Data>
                <Data name="textFont">
                  <value>bold 16px arial</value>
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
      expect(style.getText()).toBe('   bar  ');
      expect(style.getFont()).toEqual('bold 16px arial');
      expect(style.getFill()).toEqual({ color_: [32, 52, 126, 1] });
      expect(style.getScale()).toEqual(2);
      expect(style.getRotation()).toEqual('2.303834612632515');
      expect(style.getPadding()).toEqual([5, 6, 7, 8]);
      expect(style.getBackgroundFill()).toEqual({
        color_: 'rgba(255,255,255,0.01)',
      });
      expectWriteResult(feats, str);
    });
  });
});
