import React from 'react';
import renderer from 'react-test-renderer';
import Search from '.';

describe('Search', () => {
  test('matches snapshots.', () => {
    const component = renderer.create(<Search />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

// to test: custom props
// to test: searching
