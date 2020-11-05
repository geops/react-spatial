import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import MapEvent from 'ol/MapEvent';
import OLView from 'ol/View';
import OLMap from 'ol/Map';
import Zoom from './Zoom';

configure({ adapter: new Adapter() });

describe('Zoom', () => {
  test('should match snapshot.', () => {
    const map = new OLMap({});
    const component = renderer.create(<Zoom map={map} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with custom attributes', () => {
    const map = new OLMap({});
    const component = renderer.create(
      <Zoom map={map} className="foo" tabIndex={-1} title="bar" />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with zoom slider', () => {
    const map = new OLMap({});
    const component = renderer.create(<Zoom map={map} zoomSlider />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  [
    ['click', {}],
    ['keypress', { which: 13 }],
  ].forEach((evt) => {
    test(`should zoom in on ${evt[0]}.`, () => {
      const map = new OLMap({ view: new OLView({ zoom: 5 }) });
      const zooms = shallow(<Zoom map={map} />);
      zooms
        .find('.rs-zoom-in')
        .first()
        .simulate(...evt);

      expect(map.getView().getZoom()).toBe(6);
    });

    test(`should zoom in on ${evt[0]} (delta: 0.3).`, () => {
      const map = new OLMap({ view: new OLView({ zoom: 5 }) });
      const zooms = shallow(<Zoom map={map} delta={0.3} />);
      zooms
        .find('.rs-zoom-in')
        .first()
        .simulate(...evt);

      expect(map.getView().getZoom()).toBe(5.3);
    });

    test(`should zoom out on ${evt[0]}.`, () => {
      const map = new OLMap({ view: new OLView({ zoom: 5 }) });
      const zooms = shallow(<Zoom map={map} />);
      zooms
        .find('.rs-zoom-out')
        .first()
        .simulate(...evt);

      expect(map.getView().getZoom()).toBe(4);
    });

    test(`should zoom out on ${evt[0]} (delta: 0.3).`, () => {
      const map = new OLMap({ view: new OLView({ zoom: 5 }) });
      const zooms = shallow(<Zoom map={map} delta={0.3} />);
      zooms
        .find('.rs-zoom-out')
        .first()
        .simulate(...evt);

      expect(map.getView().getZoom()).toBe(4.7);
    });
  });

  test('should remove zoomSlider control on unmount.', () => {
    const map = new OLMap({});
    const spy = jest.spyOn(map, 'removeControl');
    const spy2 = jest.spyOn(map, 'addControl');
    const wrapper = mount(<Zoom map={map} zoomSlider />);
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(spy2.mock.calls[0][0]);
  });

  test('should disable zoom-in button on mount with max zoom..', () => {
    const map = new OLMap({
      view: new OLView({ maxZoom: 20, zoom: 20 }),
    });
    const spy = jest.spyOn(map.getView(), 'setZoom');
    const wrapper = mount(<Zoom map={map} />);
    act(() => {
      map.dispatchEvent(new MapEvent('moveend', map));
    });
    wrapper.update();
    expect(wrapper.find('.rs-zoom-in').prop('disabled')).toEqual(true);
    wrapper.find('.rs-zoom-in').first().simulate('click');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('should disable zoom-out button on mount with min zoom.', () => {
    const map = new OLMap({
      view: new OLView({ minZoom: 2, zoom: 2 }),
    });
    const spy = jest.spyOn(map.getView(), 'setZoom');
    const wrapper = mount(<Zoom map={map} />);
    act(() => {
      map.dispatchEvent(new MapEvent('moveend', map));
    });
    wrapper.update();
    expect(wrapper.find('.rs-zoom-out').prop('disabled')).toEqual(true);
    wrapper.find('.rs-zoom-out').first().simulate('click');
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

test('should disable zoom-out button when reaching min zoom.', () => {
  const map = new OLMap({
    view: new OLView({ minZoom: 2, zoom: 3 }),
  });
  const spy = jest.spyOn(map.getView(), 'setZoom');
  const wrapper = mount(<Zoom map={map} />);
  wrapper.find('.rs-zoom-out').first().simulate('click');
  expect(spy).toHaveBeenCalledTimes(1);
  act(() => {
    map.dispatchEvent(new MapEvent('moveend', map));
  });
  wrapper.update();
  expect(wrapper.find('.rs-zoom-out').prop('disabled')).toEqual(true);
});
