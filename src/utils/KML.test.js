import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style } from "ol/style";
import { get } from "ol/proj";
import beautify from "xml-beautifier";
import KML from "./KML";

const xmlns =
  'xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd"';

const expectWriteResult = (feats, str, fixGx = false) => {
  expect(
    beautify(
      KML.writeFeatures(
        {
          name: "lala",
          olLayer: new VectorLayer({
            source: new VectorSource({
              features: feats,
            }),
          }),
        },
        get("EPSG:4326"),
        undefined,
        fixGx,
      ),
    ),
  ).toEqual(beautify(str));
  return str;
};

describe("KML", () => {
  describe("readFeatures() and writeFeatures()", () => {
    test("should read/write LineStyle and ExtendedData (linesDash, lineStartIcon and lineEndIcon).", () => {
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
                  <Data name="lineEndIcon"><value>{"url":"fooarrowend.png","scale":0.35,"size":[36,58],"zIndex":1}</value></Data>
                  <Data name="lineStartIcon"><value>{"url":"fooarrowstart.png","scale":0.35,"size":[36,58],"zIndex":1}</value></Data>
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
        0, 1, 0,
      ]);
      expect(lineStartStyle.getZIndex()).toEqual(1);

      // line end icon
      const lineEndStyle = styles[2];
      expect(lineEndStyle.getImage().getRotation()).toEqual(
        -0.49555167348582857,
      );
      expect(lineEndStyle.getImage().getRotateWithView()).toBe(true);
      expect(lineEndStyle.getImage().getColor()).toEqual([0, 102, 5, 1]);
      expect(lineEndStyle.getGeometry()(feats[0]).getCoordinates()).toEqual([
        40, 25, 0,
      ]);
      expect(lineEndStyle.getZIndex()).toEqual(1);

      expectWriteResult(feats, str);
    });

    test("should read/write TextStyle and ExtendedData.", () => {
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
                <Data name="textStrokeColor">
                  <value>rgba(100,255,255,0.2)</value>
                </Data>
                <Data name="textStrokeWidth">
                  <value>3</value>
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
      const style = feats[0].getStyleFunction()(feats[0], 1);
      expect(feats.length).toBe(1);
      expect(style instanceof Style).toBe(true);

      // Text
      const styleText = style.getText();
      expect(styleText.getText()).toBe("bar"); // spaces are trimmed.
      expect(styleText.getFont()).toEqual("bold 16px arial");
      expect(styleText.getFill()).toEqual({ color_: [32, 52, 126, 1] });
      expect(styleText.getStroke()).toEqual({
        color_: "rgba(100,255,255,0.2)",
        width_: 3,
        lineCap_: undefined,
        lineDashOffset_: undefined,
        lineDash_: null,
        lineJoin_: undefined,
        miterLimit_: undefined,
      });
      expect(styleText.getScale()).toEqual(2);
      expect(styleText.getRotation()).toEqual("2.303834612632515");
      expect(styleText.getPadding()).toEqual([5, 6, 7, 8]);
      expect(styleText.getBackgroundFill()).toEqual({
        color_: "rgba(255,255,255,0.01)",
      });
      expect(styleText.getTextAlign()).toEqual("right");
      expect(styleText.getOffsetX()).toEqual(-90);
      expect(styleText.getOffsetY()).toEqual(30);
      expectWriteResult(feats, str);
    });

    test("should read and write lineDash and fillPattern style for polygon", () => {
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
      expect(feature.get("fillPattern")).toEqual({
        id: 3,
        color: [235, 0, 0, 1],
      });
      const color = fillStyle.getColor();
      expect(color.id).toBe(3);
      expect(color.color).toEqual([235, 0, 0, 1]);
      expectWriteResult(feats, str);
    });

    test("should add zIndex and rotation to icon style and pictureOptions to feature properties.", () => {
      const str = `
      <kml ${xmlns}>
        <Document>
            <name>lala</name>
            <Placemark>
                <description></description>
                <Style>
                    <IconStyle>
                        <scale>
                          2
                        </scale>
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
                    <Data name="iconScale">
                      <value>1</value>
                    </Data>
                    <Data name="maxZoom">
                      <value>18.5</value>
                    </Data>
                    <Data name="minZoom">
                      <value>15</value>
                    </Data>
                    <Data name="pictureOptions">
                      <value>{"resolution":4,"defaultScale":0.5}</value>
                    </Data>
                    <Data name="zIndex">
                        <value>1</value>
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
      const style = feats[0].getStyleFunction()(feats[0], 1);
      expect(style.getZIndex()).toBe(1);
      expect(style.getImage().getScale()).toEqual(2);
      expect(style.getImage().getRotation()).toBe(1.5707963267948966);
      expect(feats[0].get("pictureOptions")).toEqual({
        resolution: 4,
        defaultScale: 0.5,
      });
      expect(feats[0].get("maxZoom")).toEqual(18.5);
      expect(feats[0].get("minZoom")).toEqual(15);
      expectWriteResult(feats, str);
    });
  });

  test("should add iconScale to extended data when writing, to revert effect of https://github.com/openlayers/openlayers/pull/12695.", () => {
    const str = `
    <kml ${xmlns}>
      <Document>
          <name>lala</name>
          <Placemark>
              <description></description>
              <Style>
                  <IconStyle>
                      <scale>
                        2
                      </scale>
                      <Icon>
                          <href>https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
                          <gx:w>64</gx:w>
                          <gx:h>64</gx:h>
                      </Icon>
                      <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                  </IconStyle>
              </Style>
              <Point>
                  <coordinates>0,0,0</coordinates>
              </Point>
          </Placemark>
      </Document>
    </kml>
    `;
    const strCorrected = `
    <kml ${xmlns}>
      <Document>
          <name>lala</name>
          <Placemark>
              <description></description>
              <Style>
                  <IconStyle>
                      <scale>
                        4
                      </scale>
                      <Icon>
                          <href>https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
                          <gx:w>64</gx:w>
                          <gx:h>64</gx:h>
                      </Icon>
                      <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                  </IconStyle>
              </Style>
              <ExtendedData>
                <Data name="iconScale">
                  <value>
                    2
                  </value>
                </Data>
              </ExtendedData>
              <Point>
                  <coordinates>0,0,0</coordinates>
              </Point>
          </Placemark>
      </Document>
    </kml>
    `;
    let feats = KML.readFeatures(str);
    let style = feats[0].getStyleFunction()(feats[0], 1);
    expect(style.getImage().getScale()).toEqual(2);
    const strKmlCorrected = expectWriteResult(feats, strCorrected);

    // Next read/write should produce the same KML
    feats = KML.readFeatures(strKmlCorrected);
    style = feats[0].getStyleFunction()(feats[0], 1);
    expect(style.getImage().getScale()).toEqual(2);
    expectWriteResult(feats, strKmlCorrected);
  });

  describe("when using ol < 6.7", () => {
    test("should set doNotRevert32pxScaling to true, to don't apply the 32px scale fix for KML without icon scale extended data", () => {
      const str = `
    <kml ${xmlns}>
      <Document>
          <name>lala</name>
          <Placemark>
              <description></description>
              <Style>
                  <IconStyle>
                      <scale>
                        2
                      </scale>
                      <Icon>
                          <href>https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
                          <gx:w>64</gx:w>
                          <gx:h>64</gx:h>
                      </Icon>
                      <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                  </IconStyle>
              </Style>
              <Point>
                  <coordinates>0,0,0</coordinates>
              </Point>
          </Placemark>
      </Document>
    </kml>
    `;
      const strCorrected = `
    <kml ${xmlns}>
      <Document>
          <name>lala</name>
          <Placemark>
              <description></description>
              <Style>
                  <IconStyle>
                      <scale>
                        4
                      </scale>
                      <Icon>
                          <href>https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
                          <gx:w>64</gx:w>
                          <gx:h>64</gx:h>
                      </Icon>
                      <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                  </IconStyle>
              </Style>
              <ExtendedData>
                <Data name="iconScale">
                  <value>
                    2
                  </value>
                </Data>
              </ExtendedData>
              <Point>
                  <coordinates>0,0,0</coordinates>
              </Point>
          </Placemark>
      </Document>
    </kml>`;
      let feats = KML.readFeatures(str, null);
      let style = feats[0].getStyleFunction()(feats[0], 1);
      expect(style.getImage().getScale()).toEqual(2);
      const strKmlCorrected = expectWriteResult(feats, strCorrected);

      // Next read/write should produce the same KML
      feats = KML.readFeatures(strKmlCorrected);
      style = feats[0].getStyleFunction()(feats[0], 1);
      expect(style.getImage().getScale()).toEqual(2);
      expectWriteResult(feats, strKmlCorrected);
    });
  });

  describe("writeDocumentCamera()", () => {
    const str = `
      <kml ${xmlns}>
        <Document>
          <name>
            CamTest
          </name>
        </Document>
      </kml>`;

    const strWithCam = `<kml ${xmlns}>
        <Document>
            <name>
                CamTest
            </name>
            <Camera xmlns="">
                <Heading>
                    270
                </Heading>
                <Altitude>
                    300
                </Altitude>
                <Longitude>
                    5.8
                </Longitude>
                <Latitude>
                    41.6
                </Latitude>
            </Camera>
        </Document>
      </kml>`;

    test("should insert the correct <Camera> tag.", () => {
      const kmlWithKamera = KML.writeDocumentCamera(str, {
        heading: 270,
        altitude: 300,
        longitude: 5.8,
        latitude: 41.6,
      });
      expect(beautify(kmlWithKamera)).toEqual(beautify(strWithCam));
    });

    test("should remove the present <Camera> tag when called without cameraAttributes.", () => {
      const kmlWithoutKamera = KML.writeDocumentCamera(strWithCam);
      expect(beautify(kmlWithoutKamera)).toEqual(beautify(str));
    });
  });
});
