import VectorLayer from "ol/layer/Vector";
import { get } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { Style } from "ol/style";
import beautify from "xml-beautifier";

import KML from "./KML";

const xmlns =
  'xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd"';

const expectWriteResult = (
  feats,
  str,
  fixGx = false,
  featureProjection = get("EPSG:4326"),
) => {
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
        featureProjection,
        undefined,
        fixGx,
      ),
    ),
  ).toEqual(beautify(str));
  return str;
};

describe("KML", () => {
  describe("readFeatures() and writeFeatures()", () => {
    test("should kept the features creation order to make sure that features with same zIndex are drawn in the correct order.", () => {
      // This test is there because when a vectorLayer use useSpatialIndex: true, the getFeatures() function returns features in a random order.
      // So when the feature have the same zIndex the order could be broken (particularly for icons)
      const str = `
        <kml ${xmlns}>
          <Document>
            <name>lala</name>
            <Placemark>
              <name>foo</name>
              <Point>
                <coordinates>8.488315945955144,47.39972231582209,0</coordinates>
              </Point>
            </Placemark>
            <Placemark>
              <name>bar</name>
              <Point>
                <coordinates>8.49136346952955,47.401849541921905,0</coordinates>
              </Point>
            </Placemark>
          </Document>
        </kml>
      `;
      const feats = KML.readFeatures(str);
      expect(feats.length).toBe(2);
      expect(feats[0].get("name")).toBe("foo");
      expect(feats[1].get("name")).toBe("bar");
      const str2 = KML.writeFeatures(
        {
          name: "lala",
          olLayer: new VectorLayer({
            source: new VectorSource({
              features: feats.reverse(), // We simulate the random order of getFeatures() from rbush
            }),
          }),
        },
        get("EPSG:4326"),
        undefined,
        false,
      );
      const feats2 = KML.readFeatures(str2);
      expect(feats2.length).toBe(2);
      expect(feats2[0].get("name")).toBe("foo");
      expect(feats2[1].get("name")).toBe("bar");
    });

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
                  <Data name="lineCap"><value>butt</value></Data>
                  <Data name="lineDash"><value>40,40</value></Data>
                  <Data name="lineDashOffset"><value>5</value></Data>
                  <Data name="lineEndIcon"><value>{"scale":0.35,"size":[36,58],"url":"fooarrowend.png","zIndex":1}</value></Data>
                  <Data name="lineJoin"><value>square</value></Data>
                  <Data name="lineStartIcon"><value>{"scale":0.35,"size":[36,58],"url":"fooarrowstart.png","zIndex":1}</value></Data>
                  <Data name="miterLimit"><value>14</value></Data>
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
              <name>bar</name>
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
                <Data name="textArray">
                  <value>
                      ["bar","normal 16px arial"]
                  </value>
                </Data>
                <Data name="textBackgroundFillColor">
                  <value>rgba(255,255,255,0.01)</value>
                </Data>
                <Data name="textFont">
                  <value>normal 16px arial</value>
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
      expect(styleText.getText()).toEqual(["bar", "normal 16px arial"]);
      expect(styleText.getFont()).toEqual("normal 16px arial");
      expect(styleText.getFill()).toEqual({
        color_: [32, 52, 126, 1],
        patternImage_: null,
      });
      expect(styleText.getStroke()).toEqual({
        color_: "rgba(100,255,255,0.2)",
        lineCap_: undefined,
        lineDash_: null,
        lineDashOffset_: undefined,
        lineJoin_: undefined,
        miterLimit_: undefined,
        width_: 3,
      });
      expect(styleText.getScale()).toEqual(2);
      expect(styleText.getRotation()).toEqual("2.303834612632515");
      expect(styleText.getPadding()).toEqual([5, 6, 7, 8]);
      expect(styleText.getBackgroundFill()).toEqual({
        color_: "rgba(255,255,255,0.01)",
        patternImage_: null,
      });
      expect(styleText.getTextAlign()).toEqual("right");
      expect(styleText.getOffsetX()).toEqual(-90);
      expect(styleText.getOffsetY()).toEqual(30);
      expectWriteResult(feats, str);
    });

    test("should read/write TextStyle without trimming name", () => {
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
                <Data name="textArray">
                    <value>
                        ["   bar  ","normal 16px arial"]
                    </value>
                </Data>
                <Data name="textFont">
                  <value>normal 16px arial</value>
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
      expect(styleText.getText()).toEqual(["   bar  ", "normal 16px arial"]); // Avoid trim spaces using unicode \u200B
      expectWriteResult(feats, str);
    });

    test("should read/write TextStyle with textArray as ExtendedData.", () => {
      const str = `
        <kml ${xmlns}>
          <Document>
            <name>lala</name>
            <Placemark>
              <name>\u200B\n   foo   \n\u200B</name>
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
                <Data name="textArray">
                  <value>["\\n","","   ","","foo","bold 16px arial","   ","","\\n",""]</value>
                </Data>
                <Data name="textFont">
                  <value>normal 16px arial</value>
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

      // Make sure it is an array, the toEqual on nextline is not working properly because the array is converted to a string for comparaison.
      expect(Array.isArray(styleText.getText())).toBe(true);
      expect(styleText.getText()).toEqual([
        "\n",
        "",
        "   ",
        "",
        "foo",
        "bold 16px arial",
        "   ",
        "",
        "\n",
        "",
      ]);
      expect(styleText.getFont()).toEqual("normal 16px arial");
      expectWriteResult(feats, str);
    });

    test("should read/rewrite old TextStyle as textArray as ExtendedData.", () => {
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
                <Data name="textFont">
                  <value>normal 16px arial</value>
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

      // Make sure it is an array, the toEqual on nextline is not working properly because the array is converted to a string for comparaison.
      expect(Array.isArray(styleText.getText())).toBe(true);
      expect(styleText.getText()).toEqual(["   bar  ", "normal 16px arial"]);
      expect(styleText.getFont()).toEqual("normal 16px arial");

      const strAfter = `
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
              <Data name="textArray">
                  <value>
                      ["   bar  ","normal 16px arial"]
                  </value>
              </Data>
              <Data name="textFont">
                <value>normal 16px arial</value>
              </Data>
            </ExtendedData>
            <Point>
              <coordinates>0,0,0</coordinates>
            </Point>
          </Placemark>
        </Document>
      </kml>
    `;
      expectWriteResult(feats, strAfter);
    });

    test("should read/write old bold TextStyle as textArray as ExtendedData.", () => {
      const str = `
        <kml ${xmlns}>
          <Document>
            <name>lala</name>
            <Placemark>
              <name>\u200B\n   foo  \n\n  \n\u200B</name>
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
                <Data name="textFont">
                  <value>bold 16px arial</value>
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

      // Make sure it is an array, the toEqual on nextline is not working properly because the array is converted to a string for comparaison.
      expect(Array.isArray(styleText.getText())).toBe(true);
      expect(styleText.getText()).toEqual([
        "\u200B",
        "",
        "\n",
        "",
        "   foo  ",
        "bold 16px arial",
        "\n",
        "",
        "\u200B",
        "",
        "\n",
        "",
        "  ",
        "bold 16px arial",
        "\n",
        "",
        "\u200B",
        "",
      ]);
      expect(styleText.getFont()).toEqual("normal 16px arial");

      const strAfter = `
        <kml ${xmlns}>
          <Document>
            <name>lala</name>
            <Placemark>
              <name>\u200B\n   foo  \n\n  \n\u200B</name>
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
                <Data name="textArray">
                  <value>["\u200B","","\\n","","   foo  ","bold 16px arial","\\n","","\u200B","","\\n","","  ","bold 16px arial","\\n","","\u200B",""]</value>
                </Data>
                <Data name="textFont">
                  <value>normal 16px arial</value>
                </Data>
              </ExtendedData>
              <Point>
                <coordinates>0,0,0</coordinates>
              </Point>
            </Placemark>
          </Document>
        </kml>
      `;
      expectWriteResult(feats, strAfter);
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
        color: [235, 0, 0, 1],
        id: 3,
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
        defaultScale: 0.5,
        resolution: 4,
      });
      expect(feats[0].get("maxZoom")).toEqual(18.5);
      expect(feats[0].get("minZoom")).toEqual(15);
      expectWriteResult(feats, str);
    });

    test("should read/write Circle geometry as Polygon.", () => {
      const str = `
        <kml ${xmlns}>
          <Document>
            <name>lala</name>
            <Placemark>
              <Style>
                <LineStyle>
                  <color>ffcc9933</color>
                  <width>4</width>
                </LineStyle>
                <PolyStyle>
                  <color>ffcc9934</color>
                </PolyStyle>
              </Style>
              <ExtendedData>
                <Data name="circleGeometryCenter">
                  <value>[7.358136177061042,48.07903229472336]</value>
                </Data>
                <Data name="circleGeometryRadius">
                  <value>10000</value>
                </Data>
              </ExtendedData>
              <Polygon>
                <outerBoundaryIs>
                  <LinearRing>
                    <coordinates>7.447967705472995,48.07903229472336 7.447790443471734,48.082800648023095 7.447259357040091,48.08655385494484 7.446376542133575,48.090277108169545 7.445145482819307,48.09395572175288 7.443571037525984,48.09757518895711 7.441659419869879,48.101121239327995 7.439418174132547,48.10457989479403 7.436856145486987,48.10793752457016 7.433983445089782,48.11118089865329 7.430811410176987,48.11429723970369 7.427352559321241,48.1172742731118 7.42362054302667,48.12010027505977 7.419630089856596,48.12276411839275 7.415396948306612,48.12525531612627 7.410937824652482,48.1275640624238 7.406270317018085,48.12968127088922 7.401412845923673,48.1315986100299 7.396384581588491,48.133308535756356 7.391205368274673,48.13480432079618 7.3858956459710114,48.13608008091205 7.380476369725658,48.13713079782545 7.374968926946121,48.13795233876053 7.369395052992935,48.138541472534484 7.363776745400141,48.13889588213527 7.358136177061042,48.13901417373933 7.352495608721943,48.13889588213527 7.346877301129149,48.138541472534484 7.3413034271759665,48.13795233876053 7.335795984396427,48.13713079782545 7.330376708151074,48.13608008091205 7.325066985847412,48.13480432079618 7.319887772533594,48.133308535756356 7.3148595081984125,48.1315986100299 7.3100020371040015,48.12968127088922 7.305334529469605,48.1275640624238 7.300875405815473,48.12525531612627 7.296642264265492,48.12276411839275 7.292651811095414,48.12010027505977 7.288919794800845,48.1172742731118 7.285460943945098,48.11429723970369 7.282288909032304,48.11118089865329 7.279416208635098,48.10793752457016 7.276854179989538,48.10457989479403 7.2746129342522075,48.101121239327995 7.272701316596102,48.09757518895711 7.271126871302778,48.09395572175288 7.26989581198851,48.090277108169545 7.269012997081995,48.08655385494484 7.268481910650351,48.082800648023095 7.2683046486490905,48.07903229472336 7.268481910650351,48.07526366537863 7.269012997081995,48.07150963467535 7.26989581198851,48.067785022924085 7.271126871302778,48.06410453749396 7.272701316596102,48.06048271464289 7.2746129342522075,48.056933861975125 7.276854179989538,48.053472001756035 7.279416208635098,48.050110815311655 7.282288909032304,48.04686358873579 7.285460943945098,48.04374316012448 7.288919794800845,48.04076186855039 7.292651811095414,48.03793150498541 7.296642264265492,48.03526326536954 7.300875405815473,48.03276770601934 7.305334529469605,48.030454701556636 7.3100020371040015,48.0283334055313 7.3148595081984125,48.02641221389919 7.319887772533594,48.02469873150591 7.325066985847412,48.023199741714535 7.330376708151074,48.02192117930326 7.335795984396427,48.02086810674433 7.3413034271759665,48.020044693963655 7.346877301129149,48.01945420166405 7.352495608721943,48.019098968282265 7.358136177061042,48.01898040063341 7.363776745400141,48.019098968282265 7.369395052992935,48.01945420166405 7.374968926946119,48.020044693963655 7.380476369725658,48.02086810674433 7.3858956459710114,48.02192117930326 7.391205368274673,48.023199741714535 7.396384581588491,48.02469873150591 7.401412845923673,48.02641221389919 7.406270317018085,48.0283334055313 7.410937824652482,48.030454701556636 7.415396948306612,48.03276770601934 7.419630089856596,48.03526326536954 7.42362054302667,48.03793150498541 7.427352559321241,48.04076186855039 7.430811410176987,48.04374316012448 7.433983445089782,48.04686358873579 7.436856145486987,48.050110815311655 7.439418174132547,48.053472001756035 7.441659419869879,48.056933861975125 7.443571037525984,48.06048271464289 7.445145482819307,48.06410453749396 7.446376542133575,48.067785022924085 7.447259357040091,48.07150963467535 7.447790443471734,48.07526366537863 7.447967705472995,48.07903229472336
                    </coordinates>
                  </LinearRing>
                </outerBoundaryIs>
              </Polygon>
            </Placemark>
          </Document>
        </kml>
      `;
      const feats = KML.readFeatures(str, get("EPSG:3857"));
      const styles = feats[0].getStyle();
      expect(feats.length).toBe(1);
      expect(styles.length).toBe(1);

      expect(feats[0].getGeometry().getCenter()).toEqual([
        819103.972418, 6120013.078324001,
      ]);
      expect(feats[0].getGeometry().getRadius()).toEqual(10000);

      // circle stroke
      const strokeStyle = styles[0].getStroke();
      expect(strokeStyle.getColor()).toEqual([51, 153, 204, 1]);

      // circle fill
      const fillStyle = styles[0].getFill();
      expect(fillStyle.getColor()).toEqual([52, 153, 204, 1]);

      expectWriteResult(feats, str, false, get("EPSG:3857"));
    });

    test("should read/write IconStyle when no size defined", () => {
      const str = `
      <kml ${xmlns}>
        <Document>
            <name>lala</name>
            <Placemark>
                <description></description>
                <Style>
                    <IconStyle>
                        <scale>
                          0.166666667
                        </scale>
                        <Icon>
                            <href>https://icon-generator.geops.io/pictogram?urlPrefix=https%3A%2F%2Feditor.mapset.ch%2Fstatic%2Fimages%2F&amp;columns=2&amp;color=%2C&amp;fontsize=%2C&amp;text=%2C&amp;fill=inc%3Ach%2F02_Gleis-2_g_fr_v1.png%2Cinc%3ASBB%2F03_Gleis-3_g_fr_v1.png&amp;iconMargin=26&amp;iconSize=144&amp;format=png&amp;border=%2C</href>
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
                        0.333333
                        </scale>
                        <Icon>
                        <href>https://icon-generator.geops.io/pictogram?urlPrefix=https%3A%2F%2Feditor.mapset.ch%2Fstatic%2Fimages%2F&amp;columns=2&amp;color=%2C&amp;fontsize=%2C&amp;text=%2C&amp;fill=inc%3Ach%2F02_Gleis-2_g_fr_v1.png%2Cinc%3ASBB%2F03_Gleis-3_g_fr_v1.png&amp;iconMargin=26&amp;iconSize=144&amp;format=png&amp;border=%2C</href>
                        </Icon>
                    </IconStyle>
                </Style>
                <ExtendedData>
                  <Data name="iconScale">
                    <value>
                    0.166666667
                    </value>
                  </Data>
                </ExtendedData>
                <Point>
                    <coordinates>0,0,0</coordinates>
                </Point>
            </Placemark>
        </Document>
      </kml>`;
      let feats = KML.readFeatures(str);
      let style = feats[0].getStyleFunction()(feats[0], 1);
      expect(style.getImage().getScale()).toEqual(0.166666667);
      const strKmlCorrected = expectWriteResult(feats, strCorrected);

      // Next read/write should produce the same KML
      feats = KML.readFeatures(strKmlCorrected);
      style = feats[0].getStyleFunction()(feats[0], 1);
      expect(style.getImage().getScale()).toEqual(0.166666667);
      expectWriteResult(feats, strKmlCorrected);
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
              <ExtendedData>
                <Data name="iconScale">
                  <value>
                    1
                  </value>
                </Data>
              </ExtendedData>
              <Point>
                  <coordinates>0,0,0</coordinates>
              </Point>
          </Placemark>
      </Document>
    </kml>`;
      let feats = KML.readFeatures(str, null, true);
      let style = feats[0].getStyleFunction()(feats[0], 1);
      expect(style.getImage().getScale()).toEqual(1);
      const strKmlCorrected = expectWriteResult(feats, strCorrected);

      // Next read/write should produce the same KML
      feats = KML.readFeatures(strKmlCorrected);
      style = feats[0].getStyleFunction()(feats[0], 1);
      expect(style.getImage().getScale()).toEqual(1);
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
                <Altitude>
                    300
                </Altitude>
                <Heading>
                    270
                </Heading>
                <Latitude>
                    41.6
                </Latitude>
                <Longitude>
                    5.8
                </Longitude>
            </Camera>
        </Document>
      </kml>`;

    test("should insert the correct <Camera> tag.", () => {
      const kmlWithKamera = KML.writeDocumentCamera(str, {
        altitude: 300,
        heading: 270,
        latitude: 41.6,
        longitude: 5.8,
      });
      expect(beautify(kmlWithKamera)).toEqual(beautify(strWithCam));
    });

    test("should remove the present <Camera> tag when called without cameraAttributes.", () => {
      const kmlWithoutKamera = KML.writeDocumentCamera(strWithCam);
      expect(beautify(kmlWithoutKamera)).toEqual(beautify(str));
    });
  });
});
