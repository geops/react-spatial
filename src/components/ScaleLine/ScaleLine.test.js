import 'jest-canvas-mock';
import React from 'react';
import { configure, mount } from 'enzyme';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import renderer from 'react-test-renderer';
import ScaleLine from './ScaleLine';

configure({ adapter: new Adapter() });

describe('ScaleLine', () => {
  test('matches snapshot', () => {
    const map = new OLMap({ view: new OLView({ zoom: 7, center: [0, 0] }) });
    const component = renderer.create(<ScaleLine map={map} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('remove control on unmount.', () => {
    const map = new OLMap({});
    const spy = jest.spyOn(map, 'removeControl');
    const spy2 = jest.spyOn(map, 'addControl');
    const wrapper = mount(<ScaleLine map={map} />);
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(spy2.mock.calls[0][0]);
  });
});
