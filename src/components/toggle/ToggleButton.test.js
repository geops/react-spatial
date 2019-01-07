import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { MdMenu, MdClose } from 'react-icons/md';
import ToggleButton from './ToggleButton';

configure({ adapter: new Adapter() });
jest.useFakeTimers();

describe('ToggleButton', () => {
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

    test('no errors in the console', () => {
      shallow(<ToggleButton ariaLabel="aria-label" />);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test('matches snapshot', () => {
      const component = renderer.create(<ToggleButton />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when properties are set', () => {
    test('matches snapshot1', () => {
      const target = document.createElement('div');
      const component = renderer.create(
        <ToggleButton
          target={target}
          ariaLabel="aria-label"
          openComponent={<MdMenu focusable={false} />}
          closeComponent={<MdClose focusable={false} />}
        />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    [['click', {}], ['keypress', { which: 13 }]].forEach(evt => {
      test(`toggles on ${evt[0]} event`, () => {
        jest.useFakeTimers();
        let open = false;
        const target = document.createElement('div');
        const wrapper = mount(
          <ToggleButton
            open={open}
            target={target}
            ariaLabel="aria-label"
            openComponent={<MdMenu focusable={false} />}
            closeComponent={<MdClose focusable={false} />}
            onToggle={toggle => {
              open = toggle;
            }}
          />,
        );

        // Target hidden at start
        expect(wrapper.find(MdMenu)).toHaveLength(1);
        expect(wrapper.find(MdClose)).toHaveLength(0);
        expect(open).toBe(false);
        wrapper.setProps({ open });
        expect(target.classList.contains('tm-close')).toBe(true);
        jest.runAllTimers();
        expect(target.classList.contains('tm-hidden')).toBe(true);

        // Show the target on click
        wrapper.find('.tm-toggle-button').simulate(...evt);

        expect(open).toBe(true);
        wrapper.setProps({ open });

        expect(target.classList.contains('tm-hidden')).toBe(false);
        jest.runAllTimers();
        expect(target.classList.contains('tm-close')).toBe(false); // for 10ms

        jest.runAllTimers();

        expect(open).toBe(true);
        wrapper.setProps({ open });

        expect(target.classList.contains('tm-close')).toBe(false);
        expect(target.classList.contains('tm-hidden')).toBe(false);

        expect(wrapper.find(MdMenu)).toHaveLength(0);
        expect(wrapper.find(MdClose)).toHaveLength(1);

        // Hide the target on click
        wrapper.find('.tm-toggle-button').simulate(...evt);

        expect(open).toBe(false);
        wrapper.setProps({ open });

        expect(target.classList.contains('tm-close')).toBe(true);
        expect(target.classList.contains('tm-hidden')).toBe(false);

        jest.runAllTimers();

        expect(open).toBe(false);
        wrapper.setProps({ open });

        expect(target.classList.contains('tm-close')).toBe(true);
        expect(target.classList.contains('tm-hidden')).toBe(true);

        expect(wrapper.find(MdMenu)).toHaveLength(1);
        expect(wrapper.find(MdClose)).toHaveLength(0);
      });
    });
  });
});
