import WMTSLayer from './WMTSLayer';

test('WMTSLayer should initialize', () => {
  const layer = new WMTSLayer({
    name: 'Layer',
    url: 'tilelayer/{TileMatrix}/{TileCol}/{TileRow}.png',
  });
  expect(layer).toBeInstanceOf(WMTSLayer);
});
