import 'jest-canvas-mock';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Layer from './Layer';

const olLayer = new VectorLayer({ source: new VectorSource() });

test('Layer should initialize.', () => {
  const layer = new Layer({ name: 'Layer', olLayer });
  expect(layer).toBeInstanceOf(Layer);
});

test('Layer should be visible by default.', () => {
  const layer = new Layer({ name: 'Layer', olLayer });
  expect(layer.getVisible()).toBe(true);
});

test('Layer should be invisible if defined.', () => {
  const layer = new Layer({ name: 'Layer', visible: false, olLayer });
  expect(layer.getVisible()).toBe(false);
});

test('Layer should return its name.', () => {
  const layer = new Layer({ name: 'Layer', visible: false, olLayer });
  expect(layer.getName()).toEqual('Layer');
});

test('Layer does not add layer on init if no map provided.', () => {
  const map = new Map({});
  const layer = new Layer({ name: 'Layer', olLayer });
  const spy = jest.spyOn(map, 'addLayer');
  layer.init();
  expect(spy).toHaveBeenCalledTimes(0);
});

test('Layer should called terminate on initialization.', () => {
  const layer = new Layer({ name: 'Layer', olLayer });
  const spy = jest.spyOn(layer, 'terminate');
  layer.init();
  expect(spy).toHaveBeenCalledTimes(1);
});

test('Layer should add the layer on initialization.', () => {
  const map = new Map({});
  const layer = new Layer({ name: 'Layer', olLayer });
  const spy = jest.spyOn(map, 'addLayer');
  layer.init(map);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(olLayer);
});
