import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import Footer from './Footer';

configure({ adapter: new Adapter() });

describe('Footer', () => {
  test('matches snapshot', () => {
    const right = 'I\'m the left component';
    const component = renderer.create(<Footer right={right} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
