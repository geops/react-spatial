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

let createlayer = null;

const applyDefaultValuesOnItem = d => {
  const item = d;
  if (!item) {
    // eslint-disable-next-line no-console
    console.error(`Item undefined`);
    return;
  }

  if (!item.id) {
    // eslint-disable-next-line no-console
    console.error(`No id in ${item}`);
    return;
  }
  item.id = item.id;
  item.type = item.type || 'checkbox';
  item.isBaseLayer = item.isBaseLayer || false;

  if (item.data) {
    const { data } = item;
    if (data.type === 'wmts') {
      if (
        Object.prototype.hasOwnProperty.call(data, 'projectionExtent') &&
        Object.prototype.hasOwnProperty.call(data, 'resolutions')
      ) {
        // If 'projectionExtent' & 'resolutions' already defined.
        data.projectionExtent = data.projectionExtent;
        data.resolutions = data.resolutions;
      } else if (
        Object.prototype.hasOwnProperty.call(projections, data.projection)
      ) {
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
    item.data = {};
  }
  if (Object.prototype.hasOwnProperty.call(item.data, 'title')) {
    item.data.title = item.data.title;
  }
  item.isVisible = item.isVisible || false;
};

// Fill the data with some helpers properties
const applyDefaultValues = dataObj => {
  const d = { ...dataObj };
  Object.keys(d.items).forEach(id => {
    applyDefaultValuesOnItem(d.items[id]);
    const item = d.items[id];
    if (item.data.type === 'layerGroup') {
      Object.keys(item.children).forEach(child => {
        applyDefaultValuesOnItem(item.children[child]);
      });
    }
  });
  return d;
};

const isNotTopic = data =>
  !(
    Object.keys(data).length === 1 &&
    Object.prototype.hasOwnProperty.call(data, 'title')
  );

const getStyle = (dataStyle, styleId) => {
  if (Object.prototype.hasOwnProperty.call(dataStyle, styleId)) {
    return dataStyle[styleId];
  }
  return undefined;
};

const createXYZLayer = item => {
  const { data } = item;
  return new Layer({
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
  const { data } = item;
  return new VectorLayer({
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
  const { data } = item;
  return new Layer({
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

const createGroupLayer = (item, dataStyle) => {
  const { children } = item;
  const layers = [];
  const olLayers = [];

  Object.keys(children).forEach(childId => {
    layers.unshift(createlayer(item, children[childId], dataStyle));
  });

  for (let i = 0; i < layers.length; i += 1) {
    olLayers.push(layers[i].olLayer);
  }
  const olLayer = new Group({
    layers: olLayers,
  });

  return new LayerGroup({
    name: item.data.title,
    layers,
    olLayer,
    visibile: item.isChecked,
  });
};

createlayer = (parent, item, dataStyle) => {
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
  if (item.data.type === 'layerGroup') {
    layer = createGroupLayer(item, dataStyle);
  }
  if (parent && item.type === 'radio') {
    layer.setRadioGroup(parent.id);
  } else if (item.type === 'radio') {
    layer.setRadioGroup('root');
  }
  return layer;
};

const initialize = (map, data, dataStyle) => {
  const { items } = applyDefaultValues(data);
  const layers = [];
  Object.keys(items).forEach(layer => {
    if (isNotTopic(items[layer].data)) {
      const l = createlayer(null, items[layer], dataStyle);
      map.addLayer(l.olLayer);
      layers.unshift(l);
    }
  });

  return layers;
};

const readConfig = (map, data, dataStyle) => initialize(map, data, dataStyle);

export default { readConfig };
