/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import renderer from 'react-test-renderer';
import { Layer } from 'mobility-toolbox-js/ol';
import BaseLayerSwitcher from './BaseLayerSwitcher';

configure({ adapter: new Adapter() });

describe('BaseLayerSwitcher', () => {
  let layers;
  const layerImages = {
    layerFoo: 'foo',
    layerBar: 'bar',
    layerFoobar: 'foobar',
  };

  beforeEach(() => {
    layers = [
      new Layer({
        name: 'bl1',
        isBaseLayer: true,
      }),
      new Layer({
        name: 'bl2',
        isBaseLayer: true,
        visible: false,
      }),
      new Layer({
        name: 'bl3',
        isBaseLayer: true,
        visible: false,
      }),
    ];
  });

  describe('matches snapshots', () => {
    test('using default properties.', () => {
      const component = renderer.create(
        <BaseLayerSwitcher layers={layers} layerImages={layerImages} />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  test('the correct baselayer is visible on mount', () => {
    const comp = mount(
      <BaseLayerSwitcher layers={layers} layerImages={layerImages} />,
    );
    expect(comp.props().layers[0].visible).toBe(true);
  });

  test('removes open class and switches layer on click', () => {
    const comp = mount(
      <BaseLayerSwitcher layers={layers} layerImages={layerImages} />,
    );
    comp.find('.rs-opener').at(0).simulate('click');
    comp.find('.rs-base-layer-switcher-button').at(3).simulate('click');
    expect(
      comp.props().layers.filter((layer) => layer.isBaseLayer)[2].visible,
    ).toBe(true);
    expect(comp.find('.rs-base-layer-switcher rs-open').exists()).toBe(false);
  });

  test('toggles base map instead of opening when only two base layers', () => {
    const comp = mount(<BaseLayerSwitcher layers={layers.slice(0, 2)} />);
    expect(
      comp.props().layers.filter((layer) => layer.isBaseLayer)[0].visible,
    ).toBe(true);
    comp.find('.rs-opener').at(0).simulate('click');
    expect(
      comp.props().layers.filter((layer) => layer.isBaseLayer)[1].visible,
    ).toBe(true);
    expect(comp.find('.rs-base-layer-switcher rs-open').exists()).toBe(false);
  });
});
