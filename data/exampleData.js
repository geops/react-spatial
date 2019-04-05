import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export default [
  {
    name: 'OSM Baselayer',
    visible: true,
    isBaseLayer: true,
    data: {
      type: 'xyz',
      url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
  },
  {
    id: 'lineSamples',
    name: 'Lines Samples',
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
  {
    id: 'polySamples',
    name: 'Polygons Samples',
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
];
