const data = {
  name: 'Topic 1',
  items: {
    baselayer1: {
      id: 'baselayer1',
      type: 'checkbox',
      isChecked: true,
      isBaseLayer: true,
      data: {
        title: 'OSM Baselayer',
        type: 'xyz',
        url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    },
    sublayers1: {
      id: 'sublayers1',
      isChecked: true,
      type: 'radio',
      children: {
        usaPop: {
          id: 'usaPop',
          type: 'checkbox',
          isChecked: true,
          data: {
            title: 'USA Population Density',
            styleId: 'usaPop',
            type: 'wmts',
            url:
              'https://services.arcgisonline.com/arcgis/rest/services/' +
              'Demographics/USA_Population_Density/MapServer/WMTS/?layer=0' +
              '&style=default&tilematrixset=EPSG%3A3857&Service=WMTS&' +
              'Request=GetTile&Version=1.0.0&Format=image%2Fpng&',
          },
        },
        countryBorders: {
          id: 'countryBorders',
          type: 'checkbox',
          isChecked: false,
          data: {
            title: 'Countries Borders',
            styleId: 'countryBorders',
            type: 'vectorLayer',
            url:
              'https://openlayers.org/en/latest/examples/data/geojson/' +
              'countries.geojson',
          },
        },
      },
      data: {
        title: 'Sub-Layers',
        type: 'layerGroup',
      },
    },
    sublayers2: {
      id: 'sublayers2',
      isChecked: false,
      isExpanded: true,
      type: 'radio',
      children: {
        pointLayer: {
          id: 'pointLayer',
          type: 'radio',
          isChecked: false,
          data: {
            title: 'Points Samples',
            styleId: 'pointLayer',
            type: 'vectorLayer',
            url:
              'https://raw.githubusercontent.com/openlayers/openlayers/' +
              '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
              'point-samples.geojson',
          },
        },
        lineLayer: {
          id: 'lineLayer',
          type: 'radio',
          isChecked: false,
          data: {
            title: 'Lines Samples',
            styleId: 'lineLayer',
            type: 'vectorLayer',
            url:
              'https://raw.githubusercontent.com/openlayers/openlayers/' +
              '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
              'line-samples.geojson',
          },
        },
        polygonLayer: {
          id: 'polygonLayer',
          type: 'radio',
          isChecked: false,
          data: {
            title: 'Polygons Samples',
            styleId: 'polygonLayer',
            type: 'vectorLayer',
            url:
              'https://raw.githubusercontent.com/openlayers/openlayers/' +
              '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
              'polygon-samples.geojson',
          },
        },
      },
      data: {
        title: 'Sub-Layers 2',
        type: 'layerGroup',
      },
    },
  },
};

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
  item.data = item.data || {};
  if (Object.prototype.hasOwnProperty.call(item.data, 'title')) {
    item.data.title = item.data.title;
  }
  item.isChecked = item.isChecked || false;
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

// For styleguidist, see styleguide.config.js
if (module.exports) {
  module.exports = applyDefaultValues(data);
}
