import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import proj from '../src/Projections';

const { projectionExtent, resolutions } = proj['EPSG:3857'];

export default [
  {
    name: 'Basemap',
    visible: true,
    isBaseLayer: true,
    data: {
      type: 'wmts',
      url:
        `//vtiles.prod.geops.ch/styles/inspirationskarte_de/rendered/` +
        '{TileMatrix}/{TileCol}/{TileRow}.png',
      url2:
        `//vtiles.prod.geops.ch/styles/inspirationskarte_de/rendered/` +
        '{TileMatrix}/{TileCol}/{TileRow}@2x.png',
      url3:
        `//vtiles.prod.geops.ch/styles/inspirationskarte_de/rendered/` +
        '{TileMatrix}/{TileCol}/{TileRow}@3x.png',
      matrixSet: 'webmercator',
      requestEncoding: 'REST',
      projectionExtent,
      resolutions,
    },
    copyright:
      '© swisstopo, OpenStreetMap contributors, http://www.imagico.de/, SBB/CFF/FFS 07/2017',
  },
];
