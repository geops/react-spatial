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
  static createXYZLayer(item) {
    const conf = { ...item };
    delete conf.data;

    return new Layer({
      ...conf,
      olLayer: new TileLayer({
        zIndex: -1,
        source: new XYZ({
          url: item.data.url,
        }),
      }),
    });
  }

  static createVectorLayer(item) {
    const conf = { ...item };
    delete conf.data;

    return new VectorLayer({
      ...conf,
      source: new VectorSource({
        url: item.data.url,
        format: new GeoJSONFormat(),
      }),
      style: item.data.style,
    });
  }

  static createWMTSLayer(item) {
    const conf = { ...item };
    delete conf.data;

    return new Layer({
      ...conf,
      olLayer: new TileLayer({
        zIndex: -1,
        source: new WMTSSource({
          url: item.data.url,
          tileGrid: new WMTSTileGrid({
            extent: item.data.projectionExtent,
            resolutions: item.data.resolutions,
            matrixIds: item.data.resolutions.map((res, i) => `${i}`),
          }),
        }),
      }),
    });
  }

  static createEmptyLayer(item) {
    const conf = { ...item };
    delete conf.data;

    return new Layer({
      ...conf,
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

    return layer;
  }

  constructor(map, data, style = null) {
    this.map = map;
    this.data = data;
    this.style = style;

    this.defaults = {
      data: {},
      visible: false,
      isBaseLayer: false,
    };
  }

  loadLayerFromConfig(config) {
    // apply default values
    const item = { ...this.defaults, ...config };

    if (item.data && item.data.type === 'wmts') {
      const proj = projections[item.data.projection];
      if (proj) {
        item.data.projectionExtent = proj.projectionExtent;
        item.data.resolutions = proj.resolutions;
      }
    }

    const layer = ConfigReader.createLayer(item);
    layer.init(this.map);

    if (item.children) {
      Object.keys(item.children).forEach(childConf => {
        layer.addChild(this.loadLayerFromConfig(item.children[childConf]));
      });
    }

    return layer;
  }

  initialize() {
    return Object.keys(this.data).map(val =>
      this.loadLayerFromConfig(this.data[val]),
    );
  }
}

const readConfig = (map, data) => {
  const configReader = new ConfigReader(map, data);
  return configReader.initialize();
};

const getVisibleTopic = topicList => {
  let visibleTopic = null;
  topicList.forEach(topic => {
    if (topic.visible) {
      visibleTopic = topic;
    }
  });
  return visibleTopic.children;
};

export default { getVisibleTopic, readConfig };
