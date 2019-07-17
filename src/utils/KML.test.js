import 'jest-canvas-mock';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KML from './KML';

configure({ adapter: new Adapter() });

describe('KML', () => {
  describe('readFeatures', () => {
    test('should read LineStyle and ExtendedData (lineDash, lineStartIcon and lineEndIcon).', () => {
      const str = `
        <kml>
            <Document>
                <Placemark>
                    <Style><LineStyle><color>ff056600</color></LineStyle></Style>
                    <ExtendedData>
                        <Data name="lineDash"><value>40,40</value></Data>
                        <Data name="lineEndIcon"><value>{"url":"fooarrowend.png","scale":0.35,"size":[36,58]}</value></Data>
                        <Data name="lineStartIcon"><value>{"url":"fooarrowstart.png","scale":0.35,"size":[36,58]}</value></Data>
                    </ExtendedData>
                    <LineString><coordinates>0,1 3,5 40,25</coordinates></LineString>
                </Placemark>
            </Document>
        </kml>`;
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
      expect(
        lineStartStyle
          .getGeometry()(feats[0])
          .getCoordinates(),
      ).toEqual([0, 1, 0]);

      // line end icon
      const lineEndStyle = styles[2];
      expect(lineEndStyle.getImage().getRotation()).toEqual(
        -0.49555167348582857,
      );
      expect(lineEndStyle.getImage().getRotateWithView()).toBe(true);
      expect(lineEndStyle.getImage().getColor()).toEqual([0, 102, 5, 1]);
      expect(
        lineEndStyle
          .getGeometry()(feats[0])
          .getCoordinates(),
      ).toEqual([40, 25, 0]);
    });
  });
});
