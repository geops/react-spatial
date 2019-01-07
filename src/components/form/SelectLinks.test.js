import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import SelectLinks from './SelectLinks';

configure({ adapter: new Adapter() });

describe('SelectLinks', () => {
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

    test('displays 3 errors in the console', () => {
      shallow(<SelectLinks />);
      expect(spy).toHaveBeenCalledTimes(3);
    });

    test('matches snapshot', () => {
      const component = renderer.create(<SelectLinks />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when properties are set', () => {
    const onClick = () => {};

    const options = [
      {
        title: 'foo',
        label: 'qux',
      },
      {
        title: 'bar',
        label: 'quux',
      },
      {
        title: 'baz',
        label: 'corge',
      },
    ];

    test('matches snapshot', () => {
      const component = renderer.create(
        <SelectLinks
          isSelected={() => false}
          options={options}
          onClick={onClick}
        />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
