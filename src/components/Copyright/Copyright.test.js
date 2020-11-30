import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import { act } from 'react-dom/test-utils';
import { Layer } from 'mobility-toolbox-js/ol';
import Copyright from './Copyright';
import LayerService from '../../LayerService';

configure({ adapter: new Adapter() });

let layerService;
let layers;

describe('Copyright', () => {
  beforeEach(() => {
    layers = [
      new Layer({
        name: 'bl1',
        copyright: '© OSM Contributors',
        visible: false,
      }),
      new Layer({
        name: 'bl2',
        copyright: '© Hot OSM Contributors',
        visible: false,
      }),
      new Layer({
        name: 'bl3',
        copyright: '© Some Copyright',
        visible: false,
      }),
      new Layer({
        name: 'bl3',
        copyright: '© OSM Contributors',
        visible: false,
      }),
    ];
    layerService = new LayerService(layers);
    layers = layerService.getLayersAsFlatArray();
  });

  test('is empty if no layers are visible', () => {
    const component = mount(<Copyright layerService={layerService} />);
    expect(component.html()).toBe(null);
  });

  test('displays one copyright', () => {
    layers[1].setVisible(true);
    const component = mount(<Copyright layerService={layerService} />);
    expect(component.text()).toBe('© Hot OSM Contributors');
  });

  test('displays 2 copyrights', () => {
    layers[0].setVisible(true);
    layers[1].setVisible(true);
    const component = mount(<Copyright layerService={layerService} />);
    expect(component.text()).toBe(
      '© OSM Contributors | © Hot OSM Contributors',
    );
  });

  test('displays only unique copyrights', () => {
    layers[0].setVisible(true);
    layers[1].setVisible(true);
    layers[3].setVisible(true);
    const component = mount(<Copyright layerService={layerService} />);
    expect(component.text()).toBe(
      '© OSM Contributors | © Hot OSM Contributors',
    );
  });

  test('displays a custom copyright', () => {
    layers[1].setVisible(true);

    const component = mount(
      <Copyright
        layerService={layerService}
        format={(copyrights) => `Number of copyrights: ${copyrights.length}`}
      />,
    );

    expect(component.text()).toBe('Number of copyrights: 1');
  });

  test('update copyright when visibility change.', () => {
    const component = mount(<Copyright layerService={layerService} />);
    expect(component.text()).toBe('');
    act(() => {
      layers[1].setVisible(true);
    });
    component.update();
    expect(component.text()).toBe('© Hot OSM Contributors');
    component.unmount();
  });

  test('listen/unlisten "change:XXXX" on mount/unmount.', () => {
    // mount
    const spyOn = jest.spyOn(layerService, 'on');
    const component = mount(<Copyright layerService={layerService} />);
    expect(spyOn).toHaveBeenCalledTimes(2);
    expect(spyOn.mock.calls[0][0]).toBe('change:visible');
    expect(spyOn.mock.calls[1][0]).toBe('change:copyright');
    const cb = spyOn.mock.calls[0][1];
    const cb2 = spyOn.mock.calls[1][1];

    // unmount
    const spyUn = jest.spyOn(layerService, 'un');
    component.unmount();
    expect(spyUn).toHaveBeenCalledTimes(2);
    expect(spyUn).toHaveBeenCalledWith('change:visible', cb);
    expect(spyUn).toHaveBeenCalledWith('change:copyright', cb2);
  });

  test('displays only when copyright is defined', () => {
    layers = [
      new Layer({
        name: 'bl3',
        copyright: '© Some Copyright',
        visible: true,
      }),
      new Layer({
        name: 'bl3',
        visible: true,
      }),
    ];

    const layService = new LayerService(layers);
    const component = mount(
      <Copyright
        layerService={layService}
        format={(copyrights) => `Number of copyrights: ${copyrights.length}`}
      />,
    );
    expect(component.text()).toBe('Number of copyrights: 1');
  });
});
