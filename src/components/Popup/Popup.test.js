import React from 'react';
import renderer from 'react-test-renderer';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';

import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Line from 'ol/geom/LineString';
import Popup from './Popup';

const map = new OLMap({});

configure({ adapter: new Adapter() });

const feat = new Feature({
  geometry: new Point(0, 0),
});

const featLine = new Feature({
  geometry: new Line([[0, 0], [1, 1]]),
});

describe('Popup', () => {
  describe('should match snapshot', () => {
    test('without feature', () => {
      const component = renderer.create(
        <Popup map={map}>
          <div id="foo" />
        </Popup>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('with default values.', () => {
      const component = renderer.create(
        <Popup map={map} feature={feat}>
          <div id="foo" />
        </Popup>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('without close button.', () => {
      const component = renderer.create(
        <Popup map={map} feature={feat} showCloseButton={false}>
          <div id="bar" />
        </Popup>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('with tm-tooltip class.', () => {
      const component = renderer.create(
        <Popup map={map} feature={feat} className="tm-tooltip">
          <div id="bar" />
        </Popup>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  [['click', {}], ['keypress', { which: 13 }]].forEach(evt => {
    test(`should trigger onCloseClick function on ${evt[0]} event.`, () => {
      class Closer {
        static onCloseClick() {}
      }

      const spy = jest.spyOn(Closer, 'onCloseClick');

      const component = mount(
        <Popup
          map={map}
          feature={feat}
          onCloseClick={() => Closer.onCloseClick()}
          showCloseButton
        >
          <div id="gux" />
        </Popup>,
      );

      component
        .find('.tm-popup-close-bt')
        .at(1)
        .simulate(...evt);

      expect(spy).toHaveBeenCalled();
    });

    test(`should trigger default onCloseClick function on ${
      evt[0]
    } event without errors.`, () => {
      const component = mount(
        <Popup map={map} feature={feat} n>
          <div id="gux" />
        </Popup>,
      );
      // test if no js error triggered by the default value
      try {
        component
          .find('.tm-popup-close-bt')
          .at(1)
          .simulate(...evt);
        expect(true).toBe(true);
      } catch (e) {
        expect(false).toBe(true);
      }
    });
  });

  describe(`updates position`, () => {
    test(`on map postrender event.`, () => {
      map.getPixelFromCoordinate = jest.fn(() => [10, 200]);
      const component = shallow(
        <Popup map={map} feature={feat}>
          <div id="gux" />
        </Popup>,
      );
      const spy = jest.spyOn(component.instance(), 'updatePixelPosition');
      map.dispatchEvent({ type: 'postrender' });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  test(`deregisters postrender on unmount.`, () => {
    map.getPixelFromCoordinate = jest.fn(() => [10, 200]);
    const component = shallow(
      <Popup map={map} feature={featLine}>
        <div id="gux" />
      </Popup>,
    );
    const spy = jest.spyOn(component.instance(), 'updatePixelPosition');
    map.dispatchEvent({ type: 'postrender' });
    expect(spy).toHaveBeenCalledTimes(1);
    component.unmount();
    map.dispatchEvent({ type: 'postrender' });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
