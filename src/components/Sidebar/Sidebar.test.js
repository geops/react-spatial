import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Sidebar from './Sidebar';

configure({ adapter: new Adapter() });

describe('Sidebar', () => {
  describe('should match snapshot.', () => {
    test('when closed.', () => {
      const component = renderer.create(<Sidebar />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('when opened', () => {
      const component = renderer.create(<Sidebar open />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
