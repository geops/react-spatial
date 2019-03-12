import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import SearchInput from './SearchInput';

configure({ adapter: new Adapter() });

describe('SearchInput', () => {
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
      shallow(<SearchInput />);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test('matches snapshot', () => {
      const component = renderer.create(<SearchInput />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('calls default onBlurInput, onFocus, onKeyPress without errors.', () => {
      const wrapper = shallow(<SearchInput />);
      wrapper
        .find('input')
        .first()
        .simulate('focus', {})
        .simulate('blur', {})
        .simulate('keydown', {})
        .simulate('keyup', {});
    });
  });

  describe('when properties are set', () => {
    test('matches snapshot ', () => {
      const component = renderer.create(
        <SearchInput
          value="bar"
          className="tm-foo"
          placeholder="gux"
          onBlur={() => {}}
          onKeyPress={() => {}}
          onChange={() => {}}
        />,
      );
      expect(component.getInstance().state.focus).toBe(false);
      expect(component.toJSON()).toMatchSnapshot();
      component.getInstance().setState({ focus: true });
      expect(component.getInstance().state.focus).toBe(true);
      expect(component.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot when className is undefined ', () => {
      const component = renderer.create(<SearchInput className={undefined} />);
      expect(component.getInstance().state.focus).toBe(false);
      component.getInstance().setState({ focus: true });
      expect(component.getInstance().state.focus).toBe(true);
      expect(component.toJSON()).toMatchSnapshot();
    });

    test('calls onBlurInput, onFocus, onKeyPress properties.', () => {
      const fn = jest.fn();
      const wrapper = shallow(
        <SearchInput onBlurInput={fn} onFocus={fn} onKeyPress={fn} />,
      );
      wrapper
        .find('input')
        .first()
        .simulate('focus', {})
        .simulate('blur', {})
        .simulate('keydown', {})
        .simulate('keyup', {});
      expect(fn).toHaveBeenCalledTimes(3);
    });

    test('searchs on input change event.', () => {
      const wrapper = shallow(<SearchInput />);
      const spy = jest.spyOn(wrapper.instance(), 'search');
      const evt = {
        target: {
          value: 'foo',
        },
      };
      wrapper
        .find('input')
        .first()
        .simulate('change', evt);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(evt, 'foo');
    });

    test('searchs with an empty string on click on cross button.', () => {
      const wrapper = shallow(<SearchInput />);
      const spy = jest.spyOn(wrapper.instance(), 'search');
      const evt = {
        target: {
          value: 'foo',
        },
      };
      expect(wrapper.state('focus')).toBe(false);
      wrapper
        .find('Button')
        .first()
        .simulate('click', evt);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(evt, '');
      expect(wrapper.state('focus')).toBe(true);
    });

    test('searchs on click on search button.', () => {
      const fn = jest.fn();
      const wrapper = shallow(<SearchInput onClickSearchButton={fn} />);
      const spy = jest.spyOn(wrapper.instance(), 'search');
      const evt = {
        target: {
          value: 'foo',
        },
      };
      wrapper
        .find('Button')
        .at(1)
        .simulate('click', evt);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(evt);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('searchs on enter key up.', () => {
      const wrapper = shallow(<SearchInput />);
      const spy = jest.spyOn(wrapper.instance(), 'search');
      const evt = {
        which: 13,
      };
      wrapper.find('input').simulate('keyup', evt);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(evt);
    });

    test('focuses the input on state change.', () => {
      const wrapper = mount(<SearchInput />);
      expect(document.activeElement).toBe(document.body);
      expect(wrapper.state('focus')).toBe(false);
      wrapper.setState({
        focus: true,
      });
      wrapper.update();
      expect(wrapper.instance().refInput).toBeDefined();
      expect(document.activeElement).toBe(wrapper.instance().refInput);
    });
  });
});
