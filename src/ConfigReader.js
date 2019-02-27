import TileLayer from 'ol/layer/Tile';
import Group from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import WMTSSource from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import GeoJSONFormat from 'ol/format/GeoJSON';

import Layer from './Layer';
import LayerGroup from './LayerGroup';
import VectorLayer from './VectorLayer';

import projections from './Projections';

let createLayer;

const applyDefaultValuesOnItem = (items, it, id) => {
  const item = it;
  if (!item) {
    // eslint-disable-next-line no-console
    console.error(`Item undefined`);
    return;
  }

  item.id = item.id || id;
  item.type = item.type || 'checkbox';
  item.isBaseLayer = item.isBaseLayer || false;

  if (item.data) {
    const { data } = item;
    if (data.type === 'wmts') {
      if (data.projectionExtent && data.resolutions) {
        // If 'projectionExtent' & 'resolutions' already defined.
        data.projectionExtent = data.projectionExtent;
        data.resolutions = data.resolutions;
      } else if (projections[data.projection]) {
        // If 'projection' defined in layer & projection configuration file.
        data.projectionExtent = projections[data.projection].projectionExtent;
        data.resolutions = projections[data.projection].resolutions;
      } else {
        // eslint-disable-next-line no-console
        console.error(
          "Neither 'resolution' nor 'projectionExtent' " +
            `is defined in wmts layer '${item.id}'`,
        );
        return;
      }
    }

    item.data = item.data;
  } else {
    item.data = {
      title: item.id,
    };
  }
  item.isVisible = item.isVisible || false;

  if (item.children) {
    item.children.forEach(childId => {
      applyDefaultValuesOnItem(items, items[childId], childId);
    });
  }
};

// Fill the data with some helpers properties
const applyDefaultValues = dataObj => {
  const { items } = dataObj;
  Object.keys(items).forEach(id => {
    applyDefaultValuesOnItem(items, items[id], id);
  });
  return dataObj;
};

const getStyle = (dataStyle, styleId) => {
  if (dataStyle && dataStyle[styleId]) {
    return dataStyle[styleId];
  }
  return undefined;
};

const createXYZLayer = item => {
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
};

const createVectorLayer = (item, dataStyle) => {
  const { id, data } = item;
  return new VectorLayer({
    id,
    name: data.title,
    source: new VectorSource({
      url: data.url,
      format: new GeoJSONFormat(),
    }),
    isBaseLayer: item.isBaseLayer,
    visible: item.isVisible,
    style: getStyle(dataStyle, data.styleId),
  });
};

const createWMTSLayer = item => {
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
};

const createGroupLayer = (items, item, dataStyle) => {
  const { children } = item;
  const layers = [];
  const olLayers = [];

  children.forEach(childId => {
    layers.push(createLayer(items, item, items[childId], dataStyle));
  });

  for (let i = 0; i < layers.length; i += 1) {
    olLayers.push(layers[i].olLayer);
  }
  const olLayer = new Group({
    layers: olLayers,
  });

  return new LayerGroup({
    id: item.id,
    name: item.data.title,
    layers,
    olLayer,
    radioGroup: null,
    isBaseLayer: item.isBaseLayer,
  });
};

createLayer = (items, parent, item, dataStyle) => {
  let layer;
  if (item.data.type === 'xyz') {
    layer = createXYZLayer(item);
  }
  if (item.data.type === 'wmts') {
    layer = createWMTSLayer(item);
  }
  if (item.data.type === 'vectorLayer') {
    layer = createVectorLayer(item, dataStyle);
  }
  if (
    item.data.type === 'layerGroup' ||
    (!item.data.type && item.children && item.children.length)
  ) {
    layer = createGroupLayer(items, item, dataStyle);
  }

  if (parent && item.type === 'radio') {
    layer.setRadioGroup(parent.id);
  } else if (item.type === 'radio') {
    layer.setRadioGroup('root');
  }
  layer.olLayer.setVisible(item.isVisible);
  layer.olLayer.setProperties(item.data);
  return layer;
};

const initialize = (map, data, dataStyle) => {
  const { rootId, items } = applyDefaultValues(data);
  const layers = [];
  const l = createLayer(items, null, items[rootId], dataStyle);
  map.addLayer(l.olLayer);
  layers.push(l);
  return layers;
};

const readConfig = (map, data, dataStyle) => initialize(map, data, dataStyle);

export default { readConfig };
