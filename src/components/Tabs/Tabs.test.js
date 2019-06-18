import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tabs from './Tabs';
import Tab from '../Tab';

configure({ adapter: new Adapter() });

describe('Tabs', () => {
  describe('should match snapshot.', () => {
    test('with two tabs.', () => {
      const component = renderer.create(
        <Tabs>
          <Tab title="Tab 1" onClick={() => {}}>
            Tab 1
          </Tab>
          <Tab active title="Tab 2" onClick={() => {}}>
            Tab 2
          </Tab>
        </Tabs>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
