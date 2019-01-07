import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import List from './List';

configure({ adapter: new Adapter() });

describe('List', () => {
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
      shallow(<List />);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('matches snapshot', () => {
      const component = renderer.create(<List />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when properties are set', () => {
    const defaultItems = [
      {
        label: 'foo',
      },
      {
        label: 'bar',
      },
      {
        label: 'foo2',
      },
    ];

    const items = [
      {
        label: 'qux',
      },
      {
        label: 'quux',
      },
      {
        label: 'corge',
      },
    ];

    test('matches snapshot with defaultItems', () => {
      const component = renderer.create(
        <List
          className="tm-foo"
          defaultItems={defaultItems}
          renderTitle={() => 'my_foo_title'}
          renderItem={item => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('matches snapshot with items', () => {
      const component = renderer.create(
        <List
          className="tm-foo"
          defaultItems={defaultItems}
          items={items}
          renderTitle={() => 'my_foo_title'}
          renderItem={item => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
