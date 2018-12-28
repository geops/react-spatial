import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from './Header';

configure({ adapter: new Adapter() });

test('Header should display it\'s left component', () => {
  const left = 'I\'m the left component';
  const header = shallow(<Header left={left} />);
  expect(header.first('left').text()).toEqual(left);
});
