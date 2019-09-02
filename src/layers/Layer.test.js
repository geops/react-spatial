import 'jest-canvas-mock';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Layer from './Layer';

const olLayer = new VectorLayer({ source: new VectorSource() });

describe('Layer', () => {
  test('should initialize.', () => {
    const layer = new Layer({ name: 'Layer', olLayer });
    expect(layer).toBeInstanceOf(Layer);
  });

  test('should be visible by default.', () => {
    const layer = new Layer({ name: 'Layer', olLayer });
    expect(layer.getVisible()).toBe(true);
  });

  test('should be invisible if defined.', () => {
    const layer = new Layer({ name: 'Layer', visible: false, olLayer });
    expect(layer.getVisible()).toBe(false);
  });

  test('should return its name.', () => {
    const layer = new Layer({ name: 'Layer', visible: false, olLayer });
    expect(layer.getName()).toEqual('Layer');
  });

  test('does not add layer on init if no map provided.', () => {
    const map = new Map({});
    const layer = new Layer({ name: 'Layer', olLayer });
    const spy = jest.spyOn(map, 'addLayer');
    layer.init();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('should called terminate on initialization.', () => {
    const layer = new Layer({ name: 'Layer', olLayer });
    const spy = jest.spyOn(layer, 'terminate');
    layer.init();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should called terminate when the layer is removed.', () => {
    const layer = new Layer({ name: 'Layer', olLayer });
    const spy = jest.spyOn(layer, 'terminate');
    layer.init();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should add the layer on initialization.', () => {
    const map = new Map({});
    const layer = new Layer({ name: 'Layer', olLayer });
    const spy = jest.spyOn(map, 'addLayer');
    layer.init(map);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(olLayer);
  });

  test('should remove the layer on terminate.', () => {
    const map = new Map({});
    const layer = new Layer({ name: 'Layer', olLayer });
    const spy = jest.spyOn(map, 'removeLayer');
    layer.init(map);
    expect(spy).toHaveBeenCalledTimes(0);
    layer.terminate();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(olLayer);
  });

  test('should call terminate when the layer is removed from the map.', () => {
    const map = new Map({});
    const layer = new Layer({ name: 'Layer', olLayer });
    const spy = jest.spyOn(layer, 'terminate');
    layer.init(map);
    expect(spy).toHaveBeenCalledTimes(1);
    map.removeLayer(layer.olLayer);
    expect(spy).toHaveBeenCalledTimes(2);
    // Ensure evt was removed.
    map.removeLayer(layer.olLayer);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
