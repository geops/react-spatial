const configData = {
  name: 'Topic 1',
  items: {
    mytopic: {
      id: 'mytopic',
      isVisible: true,
      data: {
        title: 'My topic',
        type: 'layerGroup',
        expanded: true,
      },
      children: {
        baselayer1: {
          id: 'baselayer1',
          type: 'checkbox',
          isVisible: true,
          isBaseLayer: true,
          data: {
            title: 'OSM Baselayer',
            type: 'xyz',
            url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
          },
        },
        sublayers1: {
          id: 'sublayers1',
          isVisible: true,
          type: 'radio',
          data: {
            title: 'Others layers',
            type: 'layerGroup',
            expanded: true,
          },
          children: {
            countryBorders: {
              id: 'countryBorders',
              type: 'checkbox',
              isVisible: false,
              data: {
                title: 'Countries Borders',
                styleId: 'countryBorders',
                type: 'vectorLayer',
                url:
                  'https://openlayers.org/en/latest/examples/data/geojson/' +
                  'countries.geojson',
              },
            },
            usaPop: {
              id: 'usaPop',
              type: 'checkbox',
              isVisible: true,
              data: {
                title: 'USA Population Density',
                styleId: 'usaPop',
                type: 'wmts',
                url:
                  'https://services.arcgisonline.com/arcgis/rest/services/' +
                  'Demographics/USA_Population_Density/MapServer/WMTS/?layer=0' +
                  '&style=default&tilematrixset=EPSG%3A3857&Service=WMTS&' +
                  'Request=GetTile&Version=1.0.0&Format=image%2Fpng&',
                projection: 'EPSG:3857',
              },
            },
          },
        },
        sublayers2: {
          id: 'sublayers2',
          isVisible: false,
          type: 'radio',
          data: {
            title: 'Vector sample layers',
            type: 'layerGroup',
            expanded: false,
          },
          children: {
            pointLayer: {
              id: 'pointLayer',
              type: 'radio',
              isVisible: false,
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
              isVisible: false,
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
              isVisible: false,
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
        },
      },
    },
  },
};

// For styleguidist, see styleguide.config.js
if (module.exports) {
  module.exports = configData;
}
