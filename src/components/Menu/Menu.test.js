import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Menu from './Menu';
import MenuItem from '../MenuItem';

configure({ adapter: new Adapter() });

describe('Menu', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(
      <Menu>
        <MenuItem title="foo">
          <div>foo</div>
        </MenuItem>
        <MenuItem title="bar">
          <div>bar</div>
        </MenuItem>
      </Menu>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
