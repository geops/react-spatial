import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import SelectColors from './SelectColors';

configure({ adapter: new Adapter() });

describe('SelectColors', () => {
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

    test('matches snapshot', () => {
      const component = renderer.create(
        React.createElement(SelectColors, null),
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when options are strings', () => {
    const options = ['foo', 'bar', 'baz'];

    test('matches snapshot', () => {
      const component = renderer.create(
        <SelectColors options={options} value="foo" onChange={() => {}} />,
      );

      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when options are objects with a value property.', () => {
    const options = [
      { name: 'none', fill: [255, 255, 255, 0.01] },
      { name: 'black', fill: [0, 0, 0, 1] },
      { name: 'blue', fill: [0, 0, 255, 1] },
    ];

    const onChange = () => {};

    test('matches snapshot', () => {
      const component = renderer.create(
        React.createElement(SelectColors, {
          options,
          value: options[1],
          onChange: () => {},
        }),
      );

      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('executes onChange property function', () => {
      const onChangeMock = jest.fn(onChange);
      const wrapper = shallow(
        React.createElement(SelectColors, {
          options,
          value: options[2],
          onChange: onChangeMock,
        }),
      );
      expect(onChangeMock).toHaveBeenCalledTimes(0);
      const evt = { target: { name: 'none' } };
      wrapper.find('select').simulate('change', evt);
      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
