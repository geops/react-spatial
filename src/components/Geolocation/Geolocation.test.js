import React from 'react';
import renderer from 'react-test-renderer';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'jest-canvas-mock';
import Map from 'ol/Map';
import View from 'ol/View';
import MapEvent from 'ol/MapEvent';
import Geolocation from './Geolocation';

configure({ adapter: new Adapter() });

const geolocationBackup = global.navigator.geolocation;

const mockGeolocation = () => {
  const mock = {
    clearWatch: jest.fn(),
    getCurrentPosition: jest.fn(),
    watchPosition: onSuccess => {
      onSuccess({
        coords: {
          latitude: 47.9913611,
          longitude: 7.84868,
          accuracy: 55,
        },
        timestamp: 1552660077044,
      });
    },
  };

  global.navigator.geolocation = mock;
};

const mockMissingGeolocation = () => {
  delete global.navigator.geolocation;
};

const restoreGeolocation = () => {
  global.navigator.geolocation = geolocationBackup;
};

describe('Geolocation', () => {
  let map;

  beforeEach(() => {
    const target = document.createElement('div');
    const { style } = target;
    style.position = 'absolute';
    style.left = '-1000px';
    style.top = '-1000px';
    style.width = '100px';
    style.height = '100px';
    document.body.appendChild(target);

    map = new Map({
      target,
      view: new View({
        center: [0, 0],
        resolutions: [1],
        zoom: 0,
      }),
    });
    map.renderSync();
  });

  afterEach(() => {
    const target = map.getTarget();
    map.setTarget(null);
    if (target && target.parentNode) {
      target.parentNode.removeChild(target);
    }
    map.dispose();
  });

  describe('should match snapshot', () => {
    test('minimum props', () => {
      const component = renderer.create(<Geolocation map={map} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('with title', () => {
      const component = renderer.create(
        <Geolocation map={map} title="Lokalisieren" />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('with class name', () => {
      const component = renderer.create(
        <Geolocation map={map} className="my-class-name" />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('button classes', () => {
    test('class should be active', () => {
      mockGeolocation();

      const wrapper = mount(<Geolocation map={map} />);
      const basic = wrapper.getDOMNode();

      wrapper
        .find('.rs-geolocation')
        .first()
        .simulate('click');

      expect(basic.className).toBe('rs-geolocation rs-blink');

      restoreGeolocation();
    });

    test('class should not be active', () => {
      mockGeolocation();

      const wrapper = mount(<Geolocation map={map} classNameActive="active" />);
      const basic = wrapper.getDOMNode();

      wrapper
        .find('.rs-geolocation')
        .first()
        .simulate('click')
        .simulate('click');

      expect(basic.className).toBe('rs-geolocation ');

      restoreGeolocation();
    });
  });

  test(`highlight on first toggle`, () => {
    mockGeolocation();

    const component = shallow(<Geolocation map={map} />);
    const instance = component.instance();
    const spy = jest.spyOn(instance, 'highlight');
    instance.toggle();
    expect(spy).toHaveBeenCalled();

    restoreGeolocation();
  });

  test(`error function should be called`, () => {
    mockMissingGeolocation();

    class ErrorHandler {
      static onError() {}
    }

    const spy = jest.spyOn(ErrorHandler, 'onError');

    const wrapper = mount(
      <Geolocation map={map} onError={() => ErrorHandler.onError()} />,
    );

    wrapper
      .find('.rs-geolocation')
      .first()
      .simulate('click');

    expect(spy).toHaveBeenCalled();

    restoreGeolocation();
  });

  describe('map centering', () => {
    test('centers map', () => {
      mockGeolocation();

      const center1 = [742952.8821531708, 6330118.608483334];
      map.getView().setCenter(center1);

      const component = shallow(<Geolocation map={map} />);
      component.instance().toggle();

      const center2 = map.getView().getCenter();
      expect(center1).not.toEqual(center2);

      restoreGeolocation();
    });

    test('no center after drag', () => {
      mockGeolocation();

      const center1 = [742952.8821531708, 6330118.608483334];
      map.getView().setCenter(center1);

      const component = shallow(<Geolocation map={map} noCenterAfterDrag />);
      map.dispatchEvent(new MapEvent('pointerdrag', map));
      component.instance().toggle();

      const center2 = map.getView().getCenter();
      expect(center1).toEqual(center2);

      restoreGeolocation();
    });
  });

  test('custom style function', () => {
    mockGeolocation();

    const styleFunc = jest.fn();

    const component = shallow(
      <Geolocation map={map} colorOrStyleFunc={styleFunc} />,
    );
    const instance = component.instance();
    instance.toggle();
    const style = instance.layer
      .getSource()
      .getFeatures()[0]
      .getStyle();

    expect(style).toBe(styleFunc);

    restoreGeolocation();
  });
});
