import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import ListItem from './ListItem';

configure({ adapter: new Adapter() });

describe('ListItem', () => {
  const item = {
    label: 'foo',
  };
  const children = <p>bar</p>;

  describe('when no properties are set', () => {
    let spy = null;

    beforeEach(() => {
      window.console.error = jest.fn().mockImplementation(() => {});
      spy = jest.spyOn(window.console, 'error');
    });

    afterEach(() => {
      spy.mockRestore();
      window.console.error.mockRestore();
    });

    test('displays 1 error for required property ', () => {
      shallow(<ListItem />);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    test('matches snapshot', () => {
      const component = renderer.create(<ListItem />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('calls default onSelect and onKeyDown without errors.', () => {
      const wrapper = mount(<ListItem item={item}>{children}</ListItem>);
      wrapper
        .find('p')
        .first()
        .simulate('click', {})
        .simulate('keydown', {});
    });
  });

  describe('when properties are set', () => {
    test('matches snapshot', () => {
      const component = renderer.create(
        <ListItem item={item} onSelect={() => {}}>
          {children}
        </ListItem>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('calls onSelect property on click.', () => {
      const fn = jest.fn();
      const wrapper = mount(
        <ListItem item={item} onSelect={fn}>
          {children}
        </ListItem>,
      );
      wrapper
        .find('p')
        .first()
        .simulate('click', {});
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('calls onSelect property on click.', () => {
      const fn = jest.fn();
      const wrapper = mount(
        <ListItem item={item} onSelect={fn}>
          {children}
        </ListItem>,
      );
      wrapper
        .find('p')
        .first()
        .simulate('click', {});
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('calls onSelect property on enter key press.', () => {
      const fn = jest.fn();
      const wrapper = mount(
        <ListItem item={item} onSelect={fn}>
          {children}
        </ListItem>,
      );
      wrapper
        .find('p')
        .first()
        .simulate('keypress', { which: 13 });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("shouldn't calls onSelect property on key press other than enter", () => {
      const fn = jest.fn();
      const wrapper = mount(
        <ListItem item={item} onSelect={fn}>
          {children}
        </ListItem>,
      );
      wrapper
        .find('p')
        .first()
        .simulate('keypress', { which: 14 });
      expect(fn).toHaveBeenCalledTimes(0);
    });

    test('calls onKeyDown property on key down', () => {
      const fn = jest.fn();
      const wrapper = mount(
        <ListItem item={item} onKeyDown={fn}>
          {children}
        </ListItem>,
      );
      wrapper
        .find('p')
        .first()
        .simulate('keydown', {});
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
