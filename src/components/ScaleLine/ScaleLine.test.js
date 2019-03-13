import 'jest-canvas-mock';
import React from 'react';
import { configure } from 'enzyme';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import Adapter from 'enzyme-adapter-react-16';
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
});
