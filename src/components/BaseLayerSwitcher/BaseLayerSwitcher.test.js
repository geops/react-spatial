/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import renderer from 'react-test-renderer';
import ConfigReader from '../../ConfigReader';
import data from '../../../data/TreeData';
import BaseLayerSwitcher from './BaseLayerSwitcher';

configure({ adapter: new Adapter() });

const getSnapshot = newData => {
  const layers = ConfigReader.readConfig(newData || data);
  const layerImages = {
    layer1: 'foo',
  };
  const component = renderer.create(
    <BaseLayerSwitcher layers={layers} layerImages={layerImages} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
};

const mountComp = newData => {
  const layers = ConfigReader.readConfig(newData || data);
  const layerImages = {
    layerFoo: 'foo',
    layerBar: 'bar',
    layerFoobar: 'foobar',
  };
  return mount(<BaseLayerSwitcher layers={layers} layerImages={layerImages} />);
};

describe('BaseLayerToggler', () => {
  describe('matches snapshots', () => {
    test('using default properties.', () => {
      getSnapshot();
    });
  });

  test('renders one switch button per baselayer', () => {
    const comp = mountComp(data);
    expect(comp.find('.rs-base-layer-switch-button').length).toBe(3);
  });

  test('the first baselayer is visible on mount', () => {
    const comp = mountComp(data);
    expect(comp.props().layers[0].getVisible()).toBe(true);
  });

  test('unmounts close button and switches layer on click', () => {
    const comp = mountComp(data);
    comp
      .find('.rs-base-layer-switch-button')
      .at(0)
      .simulate('click');
    comp
      .find('.rs-base-layer-switch-button')
      .at(2)
      .simulate('click');
    expect(comp.find('.rs-base-layer-close').exists()).toBe(false);
    expect(
      comp
        .props()
        .layers.filter(layer => layer.getIsBaseLayer())[2]
        .getVisible(),
    ).toBe(true);
  });
});
