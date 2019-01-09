import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import ActionLink from './ActionLink';

configure({ adapter: new Adapter() });

describe('ActionLink', () => {
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

    test('displays 4 errors in the console', () => {
      shallow(<ActionLink />);
      expect(spy).toHaveBeenCalledTimes(3);
    });

    test('matches snapshot', () => {
      const component = renderer.create(<ActionLink />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when properties are set', () => {
    const label = 'foo';
    const title = ['bar'];
    const className = ['qux'];
    const onClick = () => {};

    test('matches snapshot', () => {
      const component = renderer.create(
        <ActionLink title={title} className={className} onClick={onClick}>
          {label}
        </ActionLink>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('executes onClick property function', () => {
      const fn = jest.fn(onClick);
      const fn2 = jest.fn();
      const evt = {
        preventDefault: fn2,
        stopPropagation: fn2,
      };
      const wrapper = shallow(
        <ActionLink title={title} className={className} onClick={fn}>
          {label}
        </ActionLink>,
      );
      wrapper.simulate('click', evt);
      expect(fn2).toHaveBeenCalledTimes(2);
      expect(fn.mock.calls[0][0]).toBe(evt);
    });
  });
});
