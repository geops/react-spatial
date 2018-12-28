import React from 'react';
import {
  configure, shallow,
} from 'enzyme';
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
  });


  describe('when properties are set', () => {
    test('matches snapshot ', () => {
      const component = renderer.create(<SearchInput
        value="bar"
        className="tm-foo"
        placeholder="gux"
        onBlur={() => {}}
        onKeyPress={() => {}}
        onChange={() => {}}
      />);
      expect(component.getInstance().state.focus).toBe(false);
      expect(component.toJSON()).toMatchSnapshot();
      component.getInstance().setState({ focus: true });
      expect(component.getInstance().state.focus).toBe(true);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
