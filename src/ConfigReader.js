import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import WMTSSource from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import GeoJSONFormat from 'ol/format/GeoJSON';
import Layer from './Layer';
import VectorLayer from './VectorLayer';

import projections from './Projections';

class ConfigReader {
  static getStyle(style, styleId) {
    if (style && style[styleId]) {
      return style[styleId];
    }
    return null;
  }

  static createXYZLayer(item) {
    const { id, data } = item;
    return new Layer({
      id,
      name: data.title,
      olLayer: new TileLayer({
        zIndex: -1,
        source: new XYZ({
          url: data.url,
        }),
      }),
      isBaseLayer: item.isBaseLayer,
      visible: item.isVisible,
    });
  }

  static createVectorLayer(item) {
    const { id, data, style } = item;
    return new VectorLayer({
      id,
      name: data.title,
      source: new VectorSource({
        url: data.url,
        format: new GeoJSONFormat(),
      }),
      isBaseLayer: item.isBaseLayer,
      visible: item.isVisible,
      style,
    });
  }

  static createWMTSLayer(item) {
    const { id, data } = item;
    return new Layer({
      id,
      name: data.title,
      olLayer: new TileLayer({
        zIndex: -1,
        source: new WMTSSource({
          url: data.url,
          tileGrid: new WMTSTileGrid({
            extent: item.data.projectionExtent,
            resolutions: item.data.resolutions,
            matrixIds: item.data.resolutions.map((res, i) => `${i}`),
          }),
        }),
      }),
      isBaseLayer: item.isBaseLayer,
      visible: item.isVisible,
    });
  }

  static createEmptyLayer(item) {
    const { id, data } = item;
    return new Layer({
      id,
      name: data.title,
      visible: item.isVisible,
    });
  }

  static createLayer(item) {
    let layer;

    switch (item.data.type) {
      case 'xyz':
        layer = ConfigReader.createXYZLayer(item);
        break;
      case 'wmts':
        layer = ConfigReader.createWMTSLayer(item);
        break;
      case 'vectorLayer':
        layer = ConfigReader.createVectorLayer(item);
        break;
      default:
        layer = ConfigReader.createEmptyLayer(item);
    }

    layer.setVisible(item.isVisible);
    layer.setProperties(item.data);
    return layer;
  }

  constructor(map, data, style = null) {
    this.map = map;
    this.data = data;
    this.style = style;

    this.defaults = {
      data: {},
      type: 'checkbox',
      visible: false,
      isBaseLayer: false,
    };
  }

  loadLayerFromConfig(config) {
    // apply default values
    const item = { ...this.defaults, ...config };

    if (item.data && item.data.type === 'wmts') {
      const proy = projections[item.data.projection];
      if (proy) {
        item.data.projectionExtent = proy.projectionExtent;
        item.data.resolutions = proy.resolutions;
      }
    }

    const layer = ConfigReader.createLayer(item);
    layer.init(this.map);

    if (item.children) {
      Object.values(item.children).forEach(childConf => {
        layer.addChild(this.loadLayerFromConfig(childConf));
      });
    }

    return layer;
  }

  initialize() {
    return Object.values(this.data).map(val => this.loadLayerFromConfig(val));
  }
}

const readConfig = (map, data) => {
  const configReader = new ConfigReader(map, data);
  return configReader.initialize();
};

export default { readConfig };
