import KML from './KMLFormat';

const xmlns =
  'xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd"';

describe('KML', () => {
  test('should read <Camera> tags correctly.', () => {
    const str = `
      <kml ${xmlns}>
        <Document>
        <name>lala</name>
        <Camera>
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
            <Placemark>
            <Camera>
                <Heading>
                    180
                </Heading>
                <AltitudeMode>
                    clampToGround
                </AltitudeMode>
            </Camera>
            </Placemark>
        </Document>
      </kml>
    `;
    const format = new KML();
    const cameras = format.readCamera(str);

    expect(cameras.length).toEqual(2);
    expect(cameras[0].Heading).toEqual(270);
    expect(cameras[0].Altitude).toEqual(300);
    expect(cameras[0].Longitude).toEqual(5.8);
    expect(cameras[0].Latitude).toEqual(41.6);
    expect(cameras[1].Heading).toEqual(180);
    expect(cameras[1].AltitudeMode).toEqual('clampToGround');
  });
});
