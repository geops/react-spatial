import 'jest-canvas-mock';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import PopupHandler from './PopupHandler';

proj4.defs(
  'EPSG:21781',
  '+proj=somerc +lat_0=46.95240555555556 ' +
    '+lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel ' +
    '+towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs',
);

register(proj4);

configure({ adapter: new Adapter() });

const olMap = new OLMap();

configure({ adapter: new Adapter() });

const feature = new Feature({
  geometry: new Point(0, 0),
  field_name: 'K Kiosk',
  location_details: 'Bahnebene',
  link_url: 'https://geops.ch',
});

const PopupComponent = props => (
  <div>{props.feature.get('field_name')}</div> // eslint-disable-line
);

PopupComponent.propTypes = {
  feature: PropTypes.instanceOf(Feature).isRequired,
};

test('PopupHandler should render popup', () => {
  const handler = shallow(
    <PopupHandler ContentComponent={PopupComponent} map={olMap} />,
  );

  const spy = jest.spyOn(handler.instance(), 'showPopup');
  handler.setProps({ feature });
  expect(spy).toHaveBeenCalled();
});

test('PopupHandler should render popup only once', () => {
  const handler = shallow(
    <PopupHandler ContentComponent={PopupComponent} map={olMap} />,
  );

  const spy = jest.spyOn(handler.instance(), 'showPopup');
  const spy2 = jest.spyOn(handler.instance(), 'componentDidUpdate');
  const a = { feature };
  handler.setProps(a);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(1);
  handler.setProps(a);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(2);
});

test("PopupHandler should/n't unmount popupElement", () => {
  const handler = shallow(
    <PopupHandler ContentComponent={PopupComponent} map={olMap} />,
  );
  const inst = handler.instance();
  const spy = jest.spyOn(ReactDOM, 'unmountComponentAtNode');
  inst.closePopup();
  expect(spy).toHaveBeenCalledTimes(0);

  handler.setProps({ feature });
  inst.closePopup();
  expect(spy).toHaveBeenCalledTimes(1);
});
