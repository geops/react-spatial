import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tab from './Tab';

configure({ adapter: new Adapter() });

describe('Tab', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(
      <Tab title="Tab 1" onClick={() => {}}>
        <p>This is a test</p>
      </Tab>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
