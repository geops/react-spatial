import TileLayer from 'ol/layer/Tile';
import WMTSSource from 'ol/source/WMTS';
import WMTSTilegrid from 'ol/tilegrid/WMTS';
import Layer from './Layer';

const wmtsResolutions = [
  156543.033928,
  78271.516964,
  39135.758482,
  19567.879241,
  9783.9396205,
  4891.96981025,
  2445.98490513,
  1222.99245256,
  611.496226281,
  305.748113141,
  152.87405657,
  76.4370282852,
  38.2185141426,
  19.1092570713,
  9.55462853565,
  4.77731426782,
  2.38865713391,
  1.19432856696,
  0.597164283478,
  0.298582141739,
];

const wmtsMatrixIds = wmtsResolutions.map((res, i) => `${i}`);

const projectionExtent = [
  -20037508.3428,
  -20037508.3428,
  20037508.3428,
  20037508.3428,
];

export default class WMTSLayer extends Layer {
  /**
   * Vector layer.
   * @param {string} name The layer's name
   * @param {Object} [options] Layer options
   */
  constructor(options) {
    const { url, tileGrid } = options;
    const olLayer = new TileLayer({
      source: new WMTSSource({
        url,
        requestEncoding: 'REST',
        tileGrid:
          tileGrid ||
          new WMTSTilegrid({
            extent: projectionExtent,
            resolutions: wmtsResolutions,
            matrixIds: wmtsMatrixIds,
          }),
      }),
    });

    super({ ...options, olLayer });
  }
}
