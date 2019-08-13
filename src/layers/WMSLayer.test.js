import 'jest-canvas-mock';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import fetch from 'jest-fetch-mock';
import qs from 'query-string';
import WMSLayer from './WMSLayer';

const layer = new WMSLayer({
  name: 'WMSTestLayer',
  olLayer: new ImageLayer({
    source: new ImageWMS({
      url: 'dummy',
      params: { LAYERS: 'layers' },
    }),
  }),
});

const map = new OLMap({ view: new OLView({ resolution: 5 }) });
layer.init(map);

describe('WMSLayer', () => {
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify({ features: [] }));
    global.fetch = fetch;
  });

  test('should initialize.', () => {
    expect(layer).toBeInstanceOf(WMSLayer);
  });

  test('should return a promise resolving features.', async () => {
    const data = await layer.getFeatureInfoAtCoordinate([50, 50]);
    const params = qs.parse(fetch.mock.calls[0][0].split('?')[1]);
    expect(params.REQUEST).toBe('GetFeatureInfo');
    expect(params.I).toBe('50');
    expect(params.J).toBe('50');
    expect(data.features).toEqual([]);
  });

  test('should return a layer instance and a coordinate.', async () => {
    const data = await layer.getFeatureInfoAtCoordinate([50, 50]);
    expect(data.coordinate).toEqual([50, 50]);
    expect(data.layer).toBeInstanceOf(WMSLayer);
  });
});
