import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Popup from './Popup';

configure({ adapter: new Adapter() });

const feat = new Feature({
  geometry: new Point(0, 0),
  field_name: 'K Kiosk',
  location_details: 'Bahnebene',
  link_url: 'https://geops.ch',
});

const PopupComponent = ({ feature }) => (
  <div>{feature.get('field_name')}</div>
);

PopupComponent.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

test('Popup should match snapshot.', () => {
  const component = renderer.create(<Popup
    feature={feat}
    onCloseClick={() => {}}
    showCloseButton
    ContentComponent={PopupComponent}
  />);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Popup should match snapshot without close button.', () => {
  const component = renderer.create(<Popup
    feature={feat}
    onCloseClick={() => {}}
    showCloseButton={false}
    ContentComponent={PopupComponent}
  />);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

[
  ['click', {}],
  ['keypress', { which: 13 }],
].forEach((evt) => {
  test(`Popup should close on ${evt[0]} event`, () => {
    class Closer {
      static onCloseClick() {}
    }

    const spy = jest.spyOn(Closer, 'onCloseClick');

    const component = mount(<Popup
      feature={feat}
      onCloseClick={() => Closer.onCloseClick()}
      showCloseButton
      ContentComponent={PopupComponent}
    />);

    component.find('.tm-popup-close-button').at(1).simulate(...evt);

    expect(spy).toHaveBeenCalled();
  });
});
