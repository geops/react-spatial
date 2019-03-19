import 'jest-canvas-mock';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ResizeObserver from 'resize-observer-polyfill';
import MapEvent from 'ol/MapEvent';
import OLLayer from 'ol/layer/Vector';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import BasicMap from './BasicMap';
import Layer from '../../Layer';

proj4.defs(
  'EPSG:21781',
  '+proj=somerc +lat_0=46.95240555555556 ' +
    '+lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel ' +
    '+towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs',
);

register(proj4);

configure({ adapter: new Adapter() });

const extent = [0, 0, 0, 0];
const olView = new OLView();
const olMap = new OLMap({ view: olView });
const olLayers = [
  new Layer({
    name: 'foo',
    olLayer: new OLLayer({}),
    visible: true,
  }),
];

describe('BasicMap', () => {
  test('should be rendered', () => {
    const setTarget = jest.spyOn(olMap, 'setTarget');
    shallow(<BasicMap map={olMap} />);
    expect(setTarget).toHaveBeenCalled();
  });

  test('uses onMapMoved function', () => {
    const spy = jest.fn(() => {});
    shallow(<BasicMap map={olMap} onMapMoved={spy} />);
    olMap.dispatchEvent(new MapEvent('moveend', olMap));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('uses onFeaturesClick function', () => {
    const spy = jest.fn();
    shallow(<BasicMap map={olMap} onFeaturesClick={spy} />);
    olMap.dispatchEvent(new MapEvent('singleclick', olMap));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('uses onFeaturesHover function', () => {
    const spy = jest.fn();
    shallow(<BasicMap map={olMap} onFeaturesHover={spy} />);
    olMap.dispatchEvent(new MapEvent('pointermove', olMap));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should be rendered with a default map', () => {
    const wrapper = shallow(<BasicMap />);
    expect(wrapper.instance().map).toBeDefined();
  });

  test('should be rendered with layers and an extent', () => {
    const wrapper = shallow(
      <BasicMap
        map={olMap}
        layers={olLayers}
        extent={extent}
        viewOptions={{
          minZoom: 16,
          maxZoom: 22,
          projection: 'EPSG:21781',
        }}
      />,
    );
    const inst = wrapper.instance();
    expect(inst.map).toBeDefined();
    expect(inst.map.getLayers().getLength()).toBe(1);
    expect(inst.map.getView().calculateExtent()).toEqual([
      -1.8640493388513675,
      -1.8640493388513675,
      1.8640493388513675,
      1.8640493388513675,
    ]);
  });

  test('center shoud be set', () => {
    const map = shallow(<BasicMap map={olMap} />);
    const setCenter = jest.spyOn(olMap.getView(), 'setCenter');
    map.setProps({ center: [0, 0] }).update();
    expect(setCenter).toHaveBeenCalled();
  });

  test('zoom shoud be set', () => {
    const map = shallow(<BasicMap map={olMap} zoom={5} />);
    expect(olMap.getView().getZoom()).toBe(5);
    map.setProps({ zoom: 2 }).update();
    expect(olMap.getView().getZoom()).toBe(2);
  });

  test('resolution shoud be set', () => {
    const map = shallow(<BasicMap map={olMap} resolution={100} />);
    expect(olMap.getView().getResolution()).toBe(100);
    map.setProps({ resolution: 5 }).update();
    expect(olMap.getView().getResolution()).toBe(5);
  });

  test('animation shoud be set', () => {
    const obj = {
      zoom: 4,
    };
    const map = shallow(<BasicMap map={olMap} />);
    const spy = jest.spyOn(olMap.getView(), 'animate');
    map.setProps({ animationOptions: obj }).update();
    expect(spy).toHaveBeenCalledWith(obj);
  });

  test('layers shoud be updated', () => {
    const addLayer = jest.spyOn(olMap, 'addLayer');
    const map = shallow(<BasicMap map={olMap} />);
    const layer = new Layer({ name: 'test', olLayer: new OLLayer() });
    map.setProps({ layers: [layer] }).update();
    expect(addLayer).toHaveBeenCalled();
  });

  test('should be fitted if extent is updated', () => {
    const fitExtent = jest.spyOn(OLView.prototype, 'fit');
    const map = shallow(<BasicMap map={olMap} />);
    map.setProps({ extent: [1, 2, 3, 4] }).update();
    expect(fitExtent).toHaveBeenCalled();
  });

  test('should be zoomed if zoom is updated', () => {
    const setZoom = jest.spyOn(OLView.prototype, 'setZoom');
    const map = shallow(<BasicMap map={olMap} />);
    map.setProps({ zoom: 15 }).update();
    expect(setZoom).toHaveBeenCalled();
  });

  test('size is updated when div is resized', () => {
    const spy = jest.spyOn(olMap, 'updateSize');
    const map = mount(<BasicMap map={olMap} />);
    const node = map.getDOMNode();
    expect(spy).toHaveBeenCalledTimes(1);
    // The mock class set the onResize property, we just have to run it to
    // simulate a resize
    ResizeObserver.onResize([
      {
        target: node,
        contentRect: {
          width: 20,
          height: 20,
        },
      },
    ]);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
