const topic2 = {
  id: 'topic2',
  name: 'Topic 2',
  visible: false,
  expanded: true,
  children: [
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
      name: 'Countries Borders',
      visible: true,
      data: {
        type: 'vectorLayer',
        url:
          'https://openlayers.org/en/latest/examples/data/geojson/' +
          'countries.geojson',
      },
    },
  ],
};

export default topic2;
