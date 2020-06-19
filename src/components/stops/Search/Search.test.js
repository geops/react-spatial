import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Search from '.';

configure({ adapter: new Adapter() });

describe('Search', () => {
  test('matches snapshots.', () => {
    const component = renderer.create(<Search />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

// to test: custom props
// to test: searching
