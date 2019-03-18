import React from 'react';
import renderer from 'react-test-renderer';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import OLMap from 'ol/Map';
import OLMousePosition from 'ol/control/MousePosition';
import MousePosition from './MousePosition';

configure({ adapter: new Adapter() });
const expectSnapshot = props => {
  const map = new OLMap({});
  const component = renderer.create(<MousePosition map={map} {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
};

describe('MousePosition', () => {
  describe('matches snapshots', () => {
    test('using default values.', () => {
      expectSnapshot({});
    });

    test('using no projections.', () => {
      expectSnapshot({
        projections: [],
      });
    });

    test('using only one projection', () => {
      expectSnapshot({
        projections: [{ label: 'foo', value: 'foo' }],
      });
    });

    test('using multiple projectionds.', () => {
      expectSnapshot({
        projections: [
          { label: 'foo', value: 'foo' },
          { label: 'bar', value: 'bar' },
        ],
      });
    });
  });

  test('add MousePosition control to the map.', () => {
    const map = new OLMap({});
    const spy = jest.spyOn(map, 'removeControl');
    const spy2 = jest.spyOn(map, 'addControl');
    const fn = jest.fn();
    const wrapper = mount(
      <MousePosition
        map={map}
        projections={[
          {
            label: 'EPSG:4326',
            value: 'EPSG:4326',
            format: fn,
          },
        ]}
      />,
    );
    const ctrl = wrapper.instance().control;
    expect(spy).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2.mock.calls[0][0]).toBeInstanceOf(OLMousePosition);
    expect(spy2.mock.calls[0][0]).toBe(ctrl);
    expect(ctrl.getProjection().getCode()).toBe('EPSG:4326');
    expect(ctrl.getCoordinateFormat()).toBe(fn);
  });

  test('remove MousePosition control before adding it again.', () => {
    const map = new OLMap({});
    const spy = jest.spyOn(map, 'removeControl');
    const spy2 = jest.spyOn(map, 'addControl');
    const wrapper = mount(<MousePosition map={map} />);
    expect(spy).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(1);
    wrapper.setState({
      projection: wrapper.props().projections[1],
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(spy2.mock.calls[0][0]);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(spy2.mock.calls[1][0]).toBe(wrapper.instance().control);
    expect(spy2.mock.calls[1][0]).toBeInstanceOf(OLMousePosition);
  });

  test('remove MousePosition control on unmount.', () => {
    const map = new OLMap({});
    const spy = jest.spyOn(map, 'removeControl');
    const spy2 = jest.spyOn(map, 'addControl');
    const wrapper = mount(<MousePosition map={map} />);
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(spy2.mock.calls[0][0]);
  });
});
