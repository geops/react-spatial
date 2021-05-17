import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Map } from 'ol';
import StopsFinder from '.';

configure({ adapter: new Adapter() });

describe('StopsFinder', () => {
  let map;

  beforeEach(() => {
    map = new Map({});
  });

  test('matches snapshots.', () => {
    const component = renderer.create(<StopsFinder map={map} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
