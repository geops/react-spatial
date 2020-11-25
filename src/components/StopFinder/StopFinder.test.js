import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import StopFinder from '.';

configure({ adapter: new Adapter() });

describe('StopFinder', () => {
  test('matches snapshots.', () => {
    const component = renderer.create(<StopFinder />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

// to test: custom props
// to test: searching
