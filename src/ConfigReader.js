import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import WMTSSource from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import GeoJSONFormat from 'ol/format/GeoJSON';

import Layer from './Layer';
import LayerGroup from './LayerGroup';
import VectorLayer from './VectorLayer';

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

let createlayer = null;

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
    visible: item.isChecked,
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
    visible: item.isChecked,
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
          extent: projectionExtent,
          resolutions: wmtsResolutions,
          matrixIds: wmtsMatrixIds,
        }),
      }),
    }),
    isBaseLayer: item.isBaseLayer,
    visible: item.isChecked,
  });
};

const createGroupLayer = (map, item, dataStyle) => {
  const { children } = item;
  const layers = [];

  Object.keys(children).forEach(childId => {
    layers.unshift(createlayer(map, item, children[childId], dataStyle));
  });

  return new LayerGroup({
    name: item.data.title,
    layers,
    visibile: item.isChecked,
  });
};

createlayer = (map, parent, item, dataStyle) => {
  console.log(item);
  let layer;
  if (item.data.type === 'xyz') {
    layer = createXYZLayer(item);
    map.addLayer(layer.olLayer);
  }
  if (item.data.type === 'wmts') {
    layer = createWMTSLayer(item);
    map.addLayer(layer.olLayer);
  }
  if (item.data.type === 'vectorLayer') {
    layer = createVectorLayer(item, dataStyle);
    map.addLayer(layer.olLayer);
  }
  if (item.data.type === 'layerGroup') {
    layer = createGroupLayer(map, item, dataStyle);
  }
  if (parent && item.type === 'radio') {
    layer.setRadioGroup(parent.id);
  } else if (item.type === 'radio') {
    layer.setRadioGroup('root');
  }
  return layer;
};

const initialize = (map, data, dataStyle) => {
  console.log(data);
  const { items } = data;
  const layers = [];

  Object.keys(items).forEach(layer => {
    if (isNotTopic(items[layer].data)) {
      layers.unshift(createlayer(map, null, items[layer], dataStyle));
    }
  });

  return layers;
};

const readConfig = (map, data, dataStyle) => initialize(map, data, dataStyle);

export default { readConfig };
