/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import OLMap from 'ol/Map';
import renderer from 'react-test-renderer';
import BaseLayerToggler from './BaseLayerToggler';
import exampleData from '../../../data/ExampleData';
import data from '../../../data/TreeData';
import ConfigReader from '../../ConfigReader';
import LayerService from '../../LayerService';

configure({ adapter: new Adapter() });

const shallowComp = (newData, props) => {
  const map = new OLMap({});
  const layers = ConfigReader.readConfig(newData || data);
  const layerService = new LayerService(layers);
  return shallow(
    <BaseLayerToggler
      layerService={layerService}
      map={map}
      {...(props || {})}
    />,
  );
};
const mountComp = (newData, props) => {
  const map = new OLMap({});
  const layers = ConfigReader.readConfig(newData || data);
  const layerService = new LayerService(layers);
  return mount(
    <BaseLayerToggler
      layerService={layerService}
      map={map}
      {...(props || {})}
    />,
  );
};

const expectSnapshot = (newData, props) => {
  const map = new OLMap({});
  const layers = ConfigReader.readConfig(newData || data);
  const layerService = new LayerService(layers);
  const component = renderer.create(
    <BaseLayerToggler
      layerService={layerService}
      map={map}
      {...(props || {})}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
};

describe('BaseLayerToggler', () => {
  describe('matches snapshots', () => {
    test('using default properties.', () => {
      expectSnapshot();
    });
  });

  test('initialize correctly the state', () => {
    const wrapper = shallowComp();
    const comp = wrapper.instance();
    expect(comp.state.idx).toBe(1);
    expect(comp.state.layers.length).toBe(3);
    expect(comp.state.layerVisible).toBe(comp.state.layers[0]);
  });

  test('goes forward through all available layer except the current layer displayed on the map.', () => {
    const wrapper = shallowComp();
    const comp = wrapper.instance();
    const layerVisible = comp.state.layers[0];
    expect(comp.state.layers.length).toBe(3);
    expect(comp.state.layerVisible).toBe(layerVisible);
    expect(comp.state.idx).toBe(1);

    wrapper.find('.tm-base-layer-next').simulate('click');
    expect(comp.state.layerVisible).toBe(layerVisible);
    expect(comp.state.idx).toBe(2);

    // Layer at index 0 is displayed on the map so we must ignore it
    wrapper.find('.tm-base-layer-next').simulate('click');
    expect(comp.state.layerVisible).toBe(layerVisible);
    expect(comp.state.idx).toBe(1);
  });

  test('goes backward through all available layer except the current layer displayed on the map.', () => {
    const wrapper = shallowComp();
    const comp = wrapper.instance();
    const layerVisible = comp.state.layers[0];
    expect(comp.state.layers.length).toBe(3);
    expect(comp.state.layerVisible).toBe(layerVisible);
    expect(comp.state.idx).toBe(1);

    wrapper.find('.tm-base-layer-previous').simulate('click');
    expect(comp.state.layerVisible).toBe(layerVisible);
    expect(comp.state.idx).toBe(2);

    // Layer at index 0 is displayed on the map so we must ignore it
    wrapper.find('.tm-base-layer-previous').simulate('click');
    expect(comp.state.layerVisible).toBe(layerVisible);
    expect(comp.state.idx).toBe(1);
  });

  test('displays always a baseLayer on the map.', () => {
    const wrapper = shallowComp();
    const comp = wrapper.instance();
    const layerVisible = comp.state.layers[0];
    expect(comp.state.layers.length).toBe(3);
    expect(comp.state.layerVisible).toBe(layerVisible);
    expect(comp.state.idx).toBe(1);
    comp.state.layers[0].setVisible(false);

    expect(comp.state.layers.length).toBe(3);
    expect(comp.state.layerVisible).toBe(layerVisible);
    expect(comp.state.layerVisible.getVisible()).toBe(true);
    expect(comp.state.idx).toBe(0);
  });

  test('display on the map the layer clicked', () => {
    const wrapper = mountComp(data);
    const comp = wrapper.instance();
    expect(comp.state.layers.length).toBe(3);
    expect(comp.state.layers[0].getVisible()).toBe(true);
    wrapper
      .find('.tm-base-layer-item')
      .at(1)
      .simulate('click');
    wrapper.update();
    expect(comp.state.layers[0].getVisible()).toBe(false);
    expect(comp.state.layers[1].getVisible()).toBe(true);
    expect(comp.state.layerVisible).toBe(comp.state.layers[1]);
    expect(comp.state.idx).toBe(0); // Toggle
  });

  test('hide baseLayerToggler if only one baselayer', () => {
    const wrapper = mountComp(exampleData);
    expect(wrapper.find('.tm-base-layer-item')).toBe(false);
  });
});
