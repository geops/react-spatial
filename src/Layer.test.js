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
