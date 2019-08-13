import 'jest-canvas-mock';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from './VectorLayer';

const olLayer = new OLVectorLayer({
  source: new OLVectorSource({
    features: [
      new Feature({
        attribute: 'bar',
        geometry: new Point([500, 500]),
      }),
      new Feature({
        attribute: 'foo',
        geometry: new Point([50, 50]),
      }),
    ],
  }),
});

const layer = new VectorLayer({ name: 'Layer', olLayer });
const map = new OLMap({ view: new OLView({ resolution: 5 }) });
layer.init(map);

describe('VectorLayer', () => {
  test('should initialize.', () => {
    expect(layer).toBeInstanceOf(VectorLayer);
  });

  test('should return a promise resolving a feature.', async () => {
    const data = await layer.getFeatureInfoAtCoordinate([50, 50]);
    expect(data.features.length).toBe(1);
    expect(data.features[0].get('attribute')).toBe('foo');
  });

  test('should return a layer instance and a coordinate.', async () => {
    const data = await layer.getFeatureInfoAtCoordinate([50, 50]);
    expect(data.coordinate).toEqual([50, 50]);
    expect(data.layer).toBeInstanceOf(VectorLayer);
  });
});
