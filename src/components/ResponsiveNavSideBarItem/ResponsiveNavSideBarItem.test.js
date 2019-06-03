import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ResponsiveNavSideBarItem from './ResponsiveNavSideBarItem';

configure({ adapter: new Adapter() });

describe('ResponsiveNavSideBarItem', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(<ResponsiveNavSideBarItem />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
