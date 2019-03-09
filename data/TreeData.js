import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export default {
  baselayer1: {
    name: 'OSM Baselayer',
    visible: true,
    isBaseLayer: true,
    data: {
      type: 'xyz',
      url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
  },
  sublayers1: {
    name: 'Others layers',
    visible: true,
    type: 'parent',
    children: {
      countryBorders: {
        name: 'Countries Borders',
        visible: false,
        data: {
          type: 'vectorLayer',
          url:
            'https://openlayers.org/en/latest/examples/data/geojson/' +
            'countries.geojson',
        },
      },
      usaPop: {
        name: 'USA Population Density',
        visible: true,
        data: {
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
    name: 'Vector sample layers',
    visible: 'parent',
    radioGroup: 'radio',
    children: {
      pointLayer: {
        name: 'Points Samples',
        radioGroup: 'vectorLayers',
        visible: false,
        data: {
          style: new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({
                color: '#ff0000',
              }),
            }),
          }),
          type: 'vectorLayer',
          url:
            'https://raw.githubusercontent.com/openlayers/openlayers/' +
            '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
            'point-samples.geojson',
        },
      },
      lineLayer: {
        name: 'Lines Samples',
        radioGroup: 'vectorLayers',
        visible: true,
        data: {
          style: new Style({
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2,
            }),
          }),
          type: 'vectorLayer',
          url:
            'https://raw.githubusercontent.com/openlayers/openlayers/' +
            '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
            'line-samples.geojson',
        },
      },
      polygonLayer: {
        name: 'Polygons Samples',
        radioGroup: 'vectorLayers',
        visible: false,
        data: {
          style: new Style({
            stroke: new Stroke({
              color: '#7dff8f',
              width: 3,
            }),
            fill: new Fill({
              color: 'rgba(125, 255, 143, 0.2)',
            }),
          }),
          type: 'vectorLayer',
          url:
            'https://raw.githubusercontent.com/openlayers/openlayers/' +
            '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
            'polygon-samples.geojson',
        },
      },
    },
  },
};
