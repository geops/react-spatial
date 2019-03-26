import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ArrowNorth from './ArrowNorth';

configure({ adapter: new Adapter() });

describe('CanvasSaveButton', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(<ArrowNorth className="test-class" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot rotated.', () => {
    const component = renderer.create(<ArrowNorth rotationOffset={45} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with circle.', () => {
    const component = renderer.create(<ArrowNorth circled />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
