import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import WMTSSource from 'ol/source/WMTS';
import TileJSONSource from 'ol/source/TileJSON';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import GeoJSONFormat from 'ol/format/GeoJSON';
import Layer from './Layer';
import VectorLayer from './VectorLayer';
import projections from './Projections';

const createXYZLayer = item => {
  const conf = { ...item };
  delete conf.data;

  const olLayersHd = {};
  for (let i = 2; i <= 3; i += 1) {
    olLayersHd[i] = new TileLayer({
      zIndex: -1,
      source: new XYZ({
        tilePixelRatio: i,
        url: item.data[`url${i}`],
        crossOrigin: 'Anonymous',
      }),
    });
  }

  const l = new Layer({
    ...conf,
    olLayersHd,
    olLayer: new TileLayer({
      name: conf.name,
      zIndex: -1,
      source: new XYZ({
        url: item.data.url,
        crossOrigin: 'Anonymous',
      }),
    }),
  });
  return l;
};

const createVectorLayer = item => {
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
};

const createTileJSONLayer = item => {
  const conf = { ...item };
  delete conf.data;

  return new Layer({
    ...conf,
    olLayer: new TileLayer({
      name: conf.name,
      source: new TileJSONSource({
        url: item.data.url,
        crossOrigin: 'Anonymous',
      }),
    }),
  });
};

const createWMTSLayer = item => {
  const conf = { ...item };
  delete conf.data;

  const sourceOptions = {
    url: item.data.url,
    requestEncoding: item.data.requestEncoding,
    crossOrigin: 'Anonymous',
    tileGrid: new WMTSTileGrid({
      extent: item.data.projectionExtent,
      resolutions: item.data.resolutions,
      matrixIds: item.data.resolutions.map((res, i) => `${i}`),
    }),
    matrixSet: item.data.matrixSet,
  };

  const olLayersHd = {};
  for (let i = 2; i <= 3; i += 1) {
    olLayersHd[i] = new TileLayer({
      zIndex: -1,
      source: new WMTSSource({
        ...sourceOptions,
        tilePixelRatio: i,
        url: item.data[`url${i}`],
      }),
    });
  }

  return new Layer({
    ...conf,
    olLayersHd,
    olLayer: new TileLayer({
      name: conf.name,
      zIndex: -1,
      source: new WMTSSource(sourceOptions),
    }),
  });
};

const createCustomLayer = item => {
  const conf = { ...item };
  delete conf.data;

  return new Layer({
    ...conf,
    olLayer: item.data.layer,
  });
};

const createEmptyLayer = item => {
  const conf = { ...item };
  delete conf.data;

  return new Layer({
    ...conf,
  });
};

const createLayer = item => {
  let layer;

  switch (item.data.type) {
    case 'xyz':
      layer = createXYZLayer(item);
      break;
    case 'wmts':
      layer = createWMTSLayer(item);
      break;
    case 'tileJSON':
      layer = createTileJSONLayer(item);
      break;
    case 'vectorLayer':
      layer = createVectorLayer(item);
      break;
    case 'custom':
      layer = createCustomLayer(item);
      break;
    default:
      layer = createEmptyLayer(item);
  }

  return layer;
};

const loadLayerFromConfig = (map, config) => {
  // apply default values
  const item = {
    data: [],
    visible: false,
    isBaseLayer: false,
    ...config,
  };

  if (item.data && item.data.type === 'wmts') {
    const proj = projections[item.data.projection || 'EPSG:3857'];
    if (proj) {
      item.data.projectionExtent = proj.projectionExtent;
      item.data.resolutions = proj.resolutions;
    }
  }
  const layer = createLayer(item);
  layer.init(map);

  if (item.children) {
    item.children.forEach(childConfig => {
      layer.addChild(loadLayerFromConfig(map, childConfig));
    });
  }

  return layer;
};

const readConfig = (map, data) => {
  return data.map(config => loadLayerFromConfig(map, config));
};

const getVisibleTopic = topicList => {
  let visibleTopic = null;
  topicList.forEach(topic => {
    if (topic.visible) {
      visibleTopic = topic;
    }
  });
  return visibleTopic;
};

export default { getVisibleTopic, readConfig };
