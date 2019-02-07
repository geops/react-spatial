import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';

import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Popup from './Popup';

const map = new OLMap();

configure({ adapter: new Adapter() });

const feat = new Feature({
  geometry: new Point(0, 0),
  field_name: 'K Kiosk',
  location_details: 'Bahnebene',
  link_url: 'https://geops.ch',
});

const PopupComponent = ({ feature }) => <div>{feature.get('field_name')}</div>;

PopupComponent.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

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
        .find('.tm-popup-close-button')
        .at(1)
        .simulate(...evt);

      expect(spy).toHaveBeenCalled();
    });
  });
});
