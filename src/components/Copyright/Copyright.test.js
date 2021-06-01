import 'jest-canvas-mock';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { Map, View } from 'ol';
import Tile from 'ol/Tile';
import TileLayer from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';
import { createXYZ } from 'ol/tilegrid';
import Layer from 'mobility-toolbox-js/ol/layers/Layer';
import Copyright from './Copyright';

configure({ adapter: new Adapter() });

const image = new Image();
image.width = 256;
image.height = 256;

const tileLoadFunction = () => {
  const tile = new Tile([0, 0, -1], 2 /* LOADED */);
  tile.getImage = () => image;
  return tile;
};

const getOLTileLayer = () => {
  const layer = new TileLayer({
    source: new TileSource({
      projection: 'EPSG:3857',
      tileGrid: createXYZ(),
    }),
  });
  layer.getSource().getTile = tileLoadFunction;
  return layer;
};

const getLayer = (copyrights, visible = true) =>
  new Layer({
    visible,
    copyrights,
    olLayer: getOLTileLayer(),
  });

let layers;
let map;

describe('Copyright', () => {
  beforeEach(() => {
    const target = document.createElement('div');
    document.body.appendChild(target);
    layers = [getLayer('bar'), getLayer('foo', false)];
    map = new Map({
      target,
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
      layers: layers.map((layer) => layer.olLayer),
    });
    map.setSize([200, 200]);
    layers.forEach((layer) => {
      layer.init(map);
    });
    act(() => {
      map.renderSync();
    });
  });

  afterEach(() => {
    map.setTarget(null);
    map = null;
  });

  test('is empty if no layers are visible', () => {
    const component = mount(<Copyright map={map} />);
    expect(component.html()).toBe(null);
  });

  test('displays one copyright', () => {
    const wrapper = mount(<Copyright map={map} />);
    act(() => {
      map.renderSync();
    });
    wrapper.update();
    expect(wrapper.text()).toBe('bar');
  });

  test('displays 2 copyrights', () => {
    const wrapper = mount(<Copyright map={map} />);
    layers[0].setVisible(true);
    layers[1].setVisible(true);
    act(() => {
      map.renderSync();
    });
    wrapper.update();
    expect(wrapper.text()).toBe('bar | foo');
  });

  test('displays a copyright using a custom format', () => {
    const wrapper = mount(
      <Copyright
        map={map}
        format={(copyrights) => `Number of copyrights: ${copyrights.length}`}
      />,
    );

    act(() => {
      map.renderSync();
    });
    wrapper.update();

    expect(wrapper.text()).toBe('Number of copyrights: 1');
  });

  test('set a custom className', () => {
    const wrapper = mount(<Copyright map={map} className="foo" />);
    expect(wrapper.find('.foo').length).toBe(1);
  });

  test('set a custom attribute to the root element', () => {
    const wrapper = mount(<Copyright map={map} foo="bar" />);
    expect(wrapper.find('[foo]').length).toBe(1);
  });
});
