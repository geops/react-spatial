import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OLView from 'ol/View';
import OLMap from 'ol/Map';
import Zoom from './Zoom';

configure({ adapter: new Adapter() });

test('Button should match snapshot.', () => {
  const map = new OLMap({});
  const component = renderer.create(<Zoom map={map} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should zoom in on click.', () => {
  const map = new OLMap({ view: new OLView({ zoom: 5 }) });
  const zooms = shallow(<Zoom map={map} zoomInClassName="zoom-in-class" />);
  zooms
    .find('.zoom-in-class')
    .first()
    .simulate('click');

  expect(map.getView().getZoom()).toBe(6);
});

test('Should zoom in on click.', () => {
  const map = new OLMap({ view: new OLView({ zoom: 5 }) });
  const zooms = shallow(<Zoom map={map} zoomOutClassName="zoom-out-class" />);
  zooms
    .find('.zoom-out-class')
    .first()
    .simulate('click');

  expect(map.getView().getZoom()).toBe(4);
});
