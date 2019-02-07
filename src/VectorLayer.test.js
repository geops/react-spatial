import Feature from 'ol/Feature';
import VectorLayer from './VectorLayer';
import 'jest-canvas-mock';

const features = [
  new Feature({ foo: 'bar' }),
  new Feature({ foo: 'bar' }),
  new Feature({ foo: 'baz' }),
];

test('VectorLayer should initialize', () => {
  const layer = new VectorLayer({ name: 'Layer' });
  expect(layer).toBeInstanceOf(VectorLayer);
});

test('VectorLayer should load passed features', () => {
  const layer = new VectorLayer({ name: 'Layer', features });
  expect(layer.olLayer.getSource().getFeatures().length).toBe(3);
});
