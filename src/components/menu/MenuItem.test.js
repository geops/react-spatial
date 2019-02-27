import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MenuItem from './MenuItem';

configure({ adapter: new Adapter() });

describe('MenuItem', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(
      <MenuItem title="Test2">
        <div>test</div>
      </MenuItem>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
