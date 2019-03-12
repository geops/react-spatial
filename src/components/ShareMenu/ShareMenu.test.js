import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShareMenu from './ShareMenu';

configure({ adapter: new Adapter() });

describe('ShareMenu', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(<ShareMenu title="Teilen" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
