import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import WMTSSource from 'ol/source/WMTS';
import TileJSONSource from 'ol/source/TileJSON';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import GeoJSONFormat from 'ol/format/GeoJSON';
import Layer from './layers/Layer';
import MapboxLayer from './layers/MapboxLayer';
import projections from './Projections';

const createXYZLayer = item => {
  const conf = { ...item };
  delete conf.data;

  const l = new Layer({
    ...conf,
    olLayer: new TileLayer({
      name: conf.name,
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

  return new Layer({
    ...conf,
    olLayer: new VectorLayer({
      name: conf.name,
      source: new VectorSource({
        url: item.data.url,
        format: new GeoJSONFormat(),
      }),
      style: item.data.style,
    }),
  });
};

const createMapboxLayer = item => {
  const conf = { ...item };
  delete conf.data;

  return new MapboxLayer({
    ...conf,
    url: item.data.url,
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
  const { data } = item;

  if (data.type === 'wmts') {
    const proj = projections[data.projection || 'EPSG:3857'];
    if (!data.projectionExtent && proj) {
      data.projectionExtent = proj.projectionExtent;
    }
    if (!data.resolutions && proj) {
      data.resolutions = proj.resolutions;
    }
  }

  if (!data.resolutions) {
    // eslint-disable-next-line no-console
    console.log(
      `The resolutions array is missing for the WMTS layer: ${item.name}`,
    );
  }

  const conf = { ...item };
  delete conf.data;
  return new Layer({
    ...conf,
    olLayer: new TileLayer({
      name: conf.name,
      source: new WMTSSource({
        url: data.url,
        matrixSet: data.matrixSet,
        requestEncoding: data.requestEncoding,
        crossOrigin: 'Anonymous',
        tileGrid: new WMTSTileGrid({
          extent: data.projectionExtent,
          resolutions: data.resolutions,
          matrixIds: (data.resolutions || []).map((res, i) => `${i}`),
        }),
      }),
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
    case 'mapbox':
      layer = createMapboxLayer(item);
      break;
    case 'custom':
      layer = createCustomLayer(item);
      break;
    default:
      layer = createEmptyLayer(item);
  }

  return layer;
};

const loadLayerFromConfig = config => {
  // apply default values
  const item = {
    data: [],
    visible: false,
    isBaseLayer: false,
    expandedInLegend: false,
    ...config,
  };

  const layer = createLayer(item);

  if (item.children) {
    item.children.forEach(childConfig => {
      layer.addChild(loadLayerFromConfig(childConfig));
    });
  }

  return layer;
};

const readConfig = data => {
  return data.map(config => loadLayerFromConfig(config));
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
