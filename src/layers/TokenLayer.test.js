import 'jest-canvas-mock';
import fetch from 'jest-fetch-mock';
import Map from 'ol/Map';
import View from 'ol/View';
import Layer from 'ol/layer/Layer';
import TokenLayer from './TokenLayer';

let layer;
let map;
let olLayer;
const styleUrl = 'foo.com/styles';
const foo = jest.fn((token) => Promise.resolve(token));
fetch.enableMocks();

describe('TokenLayer', () => {
  beforeEach(() => {
    fetch.enableMocks();
    olLayer = new Layer({});
    layer = new TokenLayer({
      name: 'Layer',
      url: styleUrl,
      username: 'foo',
      password: 'bar',
      tokenUrl: 'http://foo.ch/getToken',
      expiration: 59, // in minutes
      onTokenUpdate: foo,
      olLayer,
    });
    map = new Map({
      target: document.createElement('div'),
      view: new View({ center: [0, 0] }),
    });
  });

  afterEach(() => {
    fetch.disableMocks();
  });

  test('should be instanced.', () => {
    expect(layer).toBeInstanceOf(TokenLayer);
    expect(layer.username).toBe('foo');
    expect(layer.password).toBe('bar');
    expect(layer.tokenUrl).toBe('http://foo.ch/getToken');
    expect(layer.expiration).toBe(59);
    expect(layer.onTokenUpdate).toBe(foo);
  });

  test('should called terminate on initalization.', () => {
    const spy = jest.spyOn(layer, 'terminate');
    layer.init();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should add the layer on initialization and fetch the token', () => {
    fetch.mockIf(/^http:\/\/foo.ch\/getToken$/, () => {
      return Promise.resolve('token');
    });
    const spy = jest.spyOn(map, 'addLayer');
    layer.init(map);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(layer.olLayer);
    // expect(layer.onTokenUpdate).toHaveBeenCalledTimes(1);
    // expect(layer.onTokenUpdate).toHaveBeenCalledWith('token');
  });
});
