import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import Select from './Select';

configure({ adapter: new Adapter() });

describe('Select', () => {
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

    test('log error if required properties are not set.', () => {
      shallow(<Select />);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    test('matches snapshot', () => {
      const component = renderer.create(<Select />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when properties are set', () => {
    const options = [
      {
        value: 'foo',
        label: 'qux',
      },
      {
        value: 'bar',
        label: 'quux',
      },
      {
        value: 'baz',
        label: 'corge',
      },
    ];

    const onChange = () => {};

    test('matches snapshot', () => {
      const component = renderer.create(
        <Select options={options} value="bar" onChange={() => {}} />,
      );

      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('executes onChange property function', () => {
      const onChangeMock = jest.fn(onChange);
      const wrapper = shallow(
        <Select options={options} value="baz" onChange={onChangeMock} />,
      );
      expect(onChangeMock).toHaveBeenCalledTimes(0);
      wrapper.find('select').simulate('change', { target: { value: 'foo' } });
      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
