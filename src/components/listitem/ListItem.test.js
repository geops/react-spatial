import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import ListItem from './ListItem';

configure({ adapter: new Adapter() });

describe('ListItem', () => {
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
  });

  describe('when properties are set', () => {
    const item = {
      label: 'foo',
    };

    const children = <p>bar</p>;

    test('matches snapshot', () => {
      const component = renderer.create(
        <ListItem item={item} onSelect={() => {}}>
          {children}
        </ListItem>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
