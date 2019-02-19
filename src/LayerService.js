/**
 * A layer service class to handle layer adding, removing and visiblity.
 */
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import WMTSSource from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import GeoJSONFormat from 'ol/format/GeoJSON';

import Layer from './Layer';
import VectorLayer from './VectorLayer';

export default class LayerService {
  static isNotTopic(data) {
    return !(
      Object.keys(data).length === 1 &&
      Object.prototype.hasOwnProperty.call(data, 'title')
    );
  }

  static createXYZLayer(data) {
    return new Layer({
      name: data.title,
      olLayer: new TileLayer({
        zIndex: -1,
        source: new XYZ({
          url: data.url,
        }),
      }),
    });
  }

  constructor({ map, layerData, dataStyle }) {
    this.wmtsResolutions = [
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

    this.wmtsMatrixIds = this.wmtsResolutions.map((res, i) => `${i}`);

    this.projectionExtent = [
      -20037508.3428,
      -20037508.3428,
      20037508.3428,
      20037508.3428,
    ];

    this.projection = map.getView().getProjection();
    this.dataStyle = dataStyle;
    const { items } = layerData;
    this.layers = [];

    Object.keys(items).forEach(layer => {
      if (LayerService.isNotTopic(items[layer].data)) {
        if (items[layer].isChecked === true) {
          this.addLayer(map, items[layer].data);
        }
      }
    });
  }

  createWMTSLayer(data) {
    return new Layer({
      name: data.title,
      olLayer: new TileLayer({
        zIndex: -1,
        source: new WMTSSource({
          url: data.url,
          tileGrid: new WMTSTileGrid({
            extent: this.projectionExtent,
            resolutions: this.wmtsResolutions,
            matrixIds: this.wmtsMatrixIds,
          }),
        }),
      }),
    });
  }

  getStyle(styleId) {
    if (Object.prototype.hasOwnProperty.call(this.dataStyle.default, styleId)) {
      return this.dataStyle.default[styleId];
    }
    return undefined;
  }

  createVectorLayer(data) {
    return new VectorLayer({
      name: data.title,
      source: new VectorSource({
        url: data.url,
        format: new GeoJSONFormat(),
      }),
      style: this.getStyle(data.styleId),
    });
  }

  createLayer(data) {
    if (data.type === 'xyz') {
      return LayerService.createXYZLayer(data);
    }
    if (data.type === 'wmts') {
      return this.createWMTSLayer(data);
    }
    if (data.type === 'vectorLayer') {
      return this.createVectorLayer(data);
    }
    return undefined;
  }

  getLayers() {
    return this.layers;
  }

  getLayersNames() {
    const namesArray = [];
    const layers = this.getLayers();
    for (let i = 0; i < layers.length; i += 1) {
      namesArray.push(layers[i].getName());
    }
    return namesArray;
  }

  doesLayerExist(layerName) {
    return this.getLayersNames().indexOf(layerName) > -1;
  }

  getLayer(name) {
    const layers = this.getLayers();
    for (let i = 0; i < layers.length; i += 1) {
      if (layers[i].getName() === name) {
        return layers[i];
      }
    }
    return null;
  }

  addLayer(map, data) {
    const layer = this.createLayer(data);
    map.addLayer(layer.olLayer);
    this.layers.unshift(layer);
  }

  onItemChange(map, item) {
    const { data } = item;
    if (LayerService.isNotTopic(data)) {
      if (item.isChecked) {
        if (!this.doesLayerExist(data.title)) {
          this.addLayer(map, data);
        }
        this.getLayer(data.title).olLayer.setVisible(true);
      } else {
        this.getLayer(data.title).olLayer.setVisible(false);
      }
    }
  }
}
