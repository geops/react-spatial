import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Sidebar from './Sidebar';

configure({ adapter: new Adapter() });

describe('Sidebar', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(<Sidebar />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
