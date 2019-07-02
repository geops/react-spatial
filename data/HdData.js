export default [
  {
    name: 'Basemap',
    visible: true,
    data: {
      type: 'wmts',
      requestEncoding: 'REST',
      url:
        `//vtiles.prod.geops.ch/styles/inspirationskarte_de/rendered/` +
        '{TileMatrix}/{TileCol}/{TileRow}.png',
      url2:
        `//vtiles.prod.geops.ch/styles/inspirationskarte_de/rendered/` +
        '{TileMatrix}/{TileCol}/{TileRow}@2x.png',
      url3:
        `//vtiles.prod.geops.ch/styles/inspirationskarte_de/rendered/` +
        '{TileMatrix}/{TileCol}/{TileRow}@3x.png',
    },
    copyright:
      '© swisstopo, OpenStreetMap contributors, http://www.imagico.de/, SBB/CFF/FFS 07/2017',
  },
];
