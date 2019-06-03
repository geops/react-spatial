import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ResponsiveNavSideBar from './ResponsiveNavSideBar';

configure({ adapter: new Adapter() });

describe('ResponsiveNavSideBar', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(<ResponsiveNavSideBar />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
