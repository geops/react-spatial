import OLKML from 'ol/format/KML';
import {
  parse,
  pushParseAndPop,
  isDocument,
  makeStructureNS,
  makeObjectPropertySetter,
} from 'ol/xml';
import { extend, includes } from 'ol/array';
import { readDecimal, readString } from 'ol/format/xsd';

const NAMESPACE_URIS = [
  null,
  'http://earth.google.com/kml/2.0',
  'http://earth.google.com/kml/2.1',
  'http://earth.google.com/kml/2.2',
  'http://www.opengis.net/kml/2.2',
];

const CAMERA_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  Altitude: makeObjectPropertySetter(readDecimal),
  Longitude: makeObjectPropertySetter(readDecimal),
  Latitude: makeObjectPropertySetter(readDecimal),
  Tilt: makeObjectPropertySetter(readDecimal),
  AltitudeMode: makeObjectPropertySetter(readString),
  Heading: makeObjectPropertySetter(readDecimal),
  Roll: makeObjectPropertySetter(readDecimal),
});

class KML extends OLKML {
  /**
   * Read the cameras of the KML.
   *
   * @param {Document|Element|string} source Source.
   * @return {Array<Object>} Cameras.
   * @api
   */
  readCamera(source) {
    const cameras = [];
    if (typeof source === 'string') {
      const doc = parse(source);
      extend(cameras, this.readCameraFromDocument(doc));
    } else if (isDocument(source)) {
      extend(
        cameras,
        this.readCameraFromDocument(/** @type {Document} */ (source)),
      );
    } else {
      extend(cameras, this.readCameraFromNode(/** @type {Element} */ (source)));
    }
    return cameras;
  }

  /**
   * @param {Document} doc Document.
   * @return {Array<Object>} Cameras.
   */
  readCameraFromDocument(doc) {
    const cameras = [];
    for (let n = /** @type {Node} */ (doc.firstChild); n; n = n.nextSibling) {
      if (n.nodeType === Node.ELEMENT_NODE) {
        extend(cameras, this.readCameraFromNode(/** @type {Element} */ (n)));
      }
    }
    return cameras;
  }

  /**
   * @param {Element} node Node.
   * @return {Array<Object>} Cameras.
   * @api
   */
  readCameraFromNode(node) {
    const cameras = [];
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      if (
        includes(NAMESPACE_URIS, n.namespaceURI) &&
        n.localName === 'Camera'
      ) {
        const obj = pushParseAndPop({}, CAMERA_PARSERS, n, []);
        cameras.push(obj);
      }
    }
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      const { localName } = n;
      if (
        includes(NAMESPACE_URIS, n.namespaceURI) &&
        (localName === 'Document' ||
          localName === 'Folder' ||
          localName === 'Placemark' ||
          localName === 'kml')
      ) {
        extend(cameras, this.readCameraFromNode(n));
      }
    }
    return cameras;
  }
}

export default KML;
