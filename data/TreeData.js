import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export default [
  {
    name: 'OSM Baselayer',
    key: 'osm.baselayer',
    visible: true,
    isBaseLayer: true,
    copyright: '© OSM Contributors',
    data: {
      type: 'xyz',
      url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    properties: {
      radioGroup: 'baseLayer',
    },
  },
  {
    name: 'OSM Baselayer Hot',
    key: 'osm.baselayer.hot',
    visible: false,
    isBaseLayer: true,
    copyright: '© OSM Contributors',
    data: {
      type: 'xyz',
      url: 'https://c.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    },
    properties: {
      radioGroup: 'baseLayer',
    },
  },
  {
    name: 'OpenTopoMap',
    key: 'open.topo.map',
    visible: false,
    isBaseLayer: true,
    copyright:
      'map data: © OpenStreetMap contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)',
    data: {
      type: 'xyz',
      url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
    },
    properties: {
      radioGroup: 'baseLayer',
    },
  },
  {
    name: 'Other layers',
    key: 'other.layers',
    visible: true,
    type: 'parent',
    children: [
      {
        name: 'Countries',
        key: 'countries',
        properties: {
          isAlwaysExpanded: true,
        },
        visible: false,
        children: [
          {
            name: 'Countries Borders',
            key: 'country.borders',
            visible: false,
            data: {
              type: 'vectorLayer',
              url:
                'https://openlayers.org/en/latest/examples/data/geojson/' +
                'countries.geojson',
            },
          },
          {
            name: 'Countries 110m',
            key: 'country.110m',
            visible: false,
            data: {
              type: 'vectorLayer',
              url:
                'https://openlayers.org/en/latest/examples/data/geojson/' +
                'countries-110m.geojson',
            },
          },
        ],
      },
      {
        name: 'USA Population Density',
        key: 'usa.population.density',
        visible: true,
        copyright: '© Esri',
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
      {
        name: 'Switzerland',
        key: 'switzerland.samples',
        visible: true,
        properties: {
          hideInLegend: true,
        },
        data: {
          style: new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({
                color: '#ff0000',
              }),
            }),
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2,
            }),
          }),
          type: 'vectorLayer',
          url:
            'https://raw.githubusercontent.com/openlayers/openlayers/' +
            '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
            'switzerland.geojson',
        },
      },
    ],
  },
  {
    name: 'Vector sample layers',
    key: 'vector.sample.layers',
    visible: true,
    properties: {
      hideInLegend: true,
      radioGroup: 'radio',
    },
    children: [
      {
        name: 'Points Samples',
        key: 'point.samples',
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
        properties: {
          radioGroup: 'vectorLayers',
        },
      },
      {
        name: 'Lines Samples',
        key: 'lines.samples',
        visible: true,
        properties: {
          radioGroup: 'vectorLayers',
        },
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
      {
        name: 'Polygons Samples',
        key: 'polygon.samples',
        properties: {
          radioGroup: 'vectorLayers',
        },
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
    ],
  },
  {
    name: 'Road sample layers',
    key: 'road.sample.layers',
    visible: true,
    children: [
      {
        name: 'Vienna Streets',
        key: 'vienna.streets',
        visible: true,
        properties: {
          hideInLegend: true,
        },
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
            'vienna-streets.geojson',
        },
      },
      {
        name: 'Roads Seoul',
        key: 'roads.seoul',
        visible: true,
        properties: {
          hideInLegend: true,
        },
        data: {
          style: new Style({
            stroke: new Stroke({
              color: '#7dff8f',
              width: 2,
            }),
          }),
          type: 'vectorLayer',
          url:
            'https://raw.githubusercontent.com/openlayers/openlayers/' +
            '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
            'roads-seoul.geojson',
        },
      },
    ],
  },
];
