/**
 *  Node definition:
 *
 *     id: 'root',
 *     children: ['node1', 'node2'],
 *     isExpanded: true,
 *     isChecked: false,
 *     isChildrenLoading: false,
 *     type: 'checkbox',
 *     data: {
 *       title: 'root',
 *     },
 *
 */

const data = {
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: ['node1'],
      type: 'checkbox',
      data: {
        title: 'root',
      },
    },
    node1: {
      id: 'node1',
      isChecked: true,
      isExpanded: true,
      type: 'radio',
      children: ['baselayer1', 'node2', 'node3'],
      data: {
        title: 'Topic 1',
      },
    },
    baselayer1: {
      id: 'baselayer1',
      type: 'checkbox',
      isChecked: true,
      defaults: {
        isChecked: true,
      },
      data: {
        title: 'OSM Baselayer',
        type: 'xyz',
        url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    },
    node2: {
      id: 'node2',
      isChecked: true,
      isExpanded: true,
      type: 'radio',
      children: ['child21', 'child22'],
      data: {
        title: 'Sub-Layers 1',
      },
    },
    child21: {
      id: 'child21',
      type: 'checkbox',
      isChecked: true,
      defaults: {
        isChecked: true,
      },
      data: {
        title: 'USA Population Density',
        styleId: 'child21',
        type: 'wmts',
        url:
          'https://services.arcgisonline.com/arcgis/rest/services/' +
          'Demographics/USA_Population_Density/MapServer/WMTS/?layer=0' +
          '&style=default&tilematrixset=EPSG%3A3857&Service=WMTS&' +
          'Request=GetTile&Version=1.0.0&Format=image%2Fpng&',
      },
    },
    child22: {
      id: 'child22',
      type: 'checkbox',
      isChecked: false,
      defaults: {
        isChecked: false,
      },
      data: {
        title: 'Countries Borders',
        styleId: 'child22',
        type: 'vectorLayer',
        url:
          'https://openlayers.org/en/latest/examples/data/geojson/' +
          'countries.geojson',
      },
    },
    node3: {
      id: 'node3',
      isChecked: false,
      isExpanded: true,
      type: 'radio',
      children: ['child31', 'child32', 'child33'],
      data: {
        title: 'Sub-Layers 2',
      },
    },
    child31: {
      id: 'child31',
      type: 'radio',
      isChecked: false,
      defaults: {
        isChecked: true,
      },
      data: {
        title: 'Points Samples',
        styleId: 'child31',
        type: 'vectorLayer',
        url:
          'https://raw.githubusercontent.com/openlayers/openlayers/' +
          '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
          'point-samples.geojson',
      },
    },
    child32: {
      id: 'child32',
      type: 'radio',
      isChecked: false,
      defaults: {
        isChecked: false,
      },
      data: {
        title: 'Lines Samples',
        styleId: 'child32',
        type: 'vectorLayer',
        url:
          'https://raw.githubusercontent.com/openlayers/openlayers/' +
          '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
          'line-samples.geojson',
      },
    },
    child33: {
      id: 'child33',
      type: 'radio',
      isChecked: false,
      defaults: {
        isChecked: false,
      },
      data: {
        title: 'Polygons Samples',
        styleId: 'child33',
        type: 'vectorLayer',
        url:
          'https://raw.githubusercontent.com/openlayers/openlayers/' +
          '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
          'polygon-samples.geojson',
      },
    },
  },
};

const applyDefaultValuesOnItem = (d, id) => {
  const item = d.items[id];
  if (!item) {
    // eslint-disable-next-line no-console
    console.error(`No item with id  ${id}`);
    return;
  }
  item.id = item.id || id;
  item.type = item.type || 'checkbox';
  item.data = item.data || {};
  item.data.title = item.data.title || id;
  item.hasChildren = !!(item.children && item.children.length);
  item.hasParent = item.hasParent || false;
  item.parentId = item.parentId || null;
  item.isExpanded = item.isExpanded || false;
  item.isChecked = item.isChecked || false;
  item.isChildrenLoading = item.isChildrenLoading || false;
};

// Fill the data tree with some helpers properties
const applyDefaultValues = dat => {
  const d = { ...dat };
  Object.keys(d.items).forEach(id => {
    applyDefaultValuesOnItem(d, id);
    const item = d.items[id];
    if (item.hasChildren) {
      item.hasChildren = true;
      item.children.forEach(childId => {
        applyDefaultValuesOnItem(d, childId);
        d.items[childId].parentId = id;
        d.items[childId].hasParent = true;
      });
    } else {
      item.children = [];
    }
  });
  return d;
};

// For styleguidist, see styleguide.config.js
if (module.exports) {
  module.exports = applyDefaultValues(data);
}
