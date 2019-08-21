import 'jest-canvas-mock';
import Map from 'ol/Map';
import View from 'ol/View';
import mapboxgl from 'mapbox-gl';
import MapboxLayer from './MapboxLayer';

let layer;
let map;
const styleUrl = 'foo.com/styles';

describe('MapboxLayer', () => {
  beforeEach(() => {
    layer = new MapboxLayer({
      name: 'Layer',
      url: styleUrl,
    });
    map = new Map({
      target: document.createElement('div'),
      view: new View({ center: [0, 0] }),
    });
  });

  test('should be instanced.', () => {
    expect(layer).toBeInstanceOf(MapboxLayer);
    expect(layer.styleUrl).toBe(styleUrl);
  });

  test('should not initalized mapbox map.', () => {
    layer.init();
    expect(layer.mbMap).toBe();
  });

  test('should initalized mapbox map.', () => {
    layer.init(map);
    expect(layer.mbMap).toBeInstanceOf(mapboxgl.Map);
  });

  test('should called terminate on initalization.', () => {
    const spy = jest.spyOn(layer, 'terminate');
    layer.init();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should add the layer on initialization.', () => {
    const spy = jest.spyOn(map, 'addLayer');
    layer.init(map);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(layer.olLayer);
  });
});
