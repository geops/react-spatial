import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Menu from './Menu';
import MenuItem from './MenuItem';

configure({ adapter: new Adapter() });

test('Menu should match snapshot.', () => {
  const component = renderer.create(
    <Menu
      menuVisible
      menuItems={[
        {
          title: 'Teilen',
          element: <MenuItem defaultMenuName="share" />,
        },
        {
          title: 'Test',
          element: <MenuItem element={<div>test</div>} />,
        },
      ]}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
