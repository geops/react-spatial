import React from 'react';
import renderer from 'react-test-renderer';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Autocomplete from './Autocomplete';

configure({ adapter: new Adapter() });

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

const state = {
  showList: false,
};

describe('Autocomplete', () => {
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
      const component = renderer.create(<Autocomplete />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('when properties are set', () => {
    test('should match snapshot without items and defaultItems', () => {
      const component = renderer.create(
        <Autocomplete
          value="fooval"
          renderTitle={() => 'my_foo_title'}
          renderItem={item => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      state.showList = true;
      component.root.instance.setState(state);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot without defaultItems', () => {
      const component = renderer.create(
        <Autocomplete
          value="fooval"
          items={items}
          renderTitle={() => 'my_foo_title'}
          renderItem={item => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      state.showList = true;
      component.root.instance.setState(state);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot without items', () => {
      const component = renderer.create(
        <Autocomplete
          value="fooval"
          defaultItems={defaultItems}
          renderTitle={() => 'my_foo_title'}
          renderItem={item => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      state.showList = true;
      component.root.instance.setState(state);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot', () => {
      const component = renderer.create(
        <Autocomplete
          value="fooval"
          defaultItems={defaultItems}
          items={items}
          renderTitle={() => 'my_foo_title'}
          renderItem={item => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      component.root.instance.setState(state);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot showing list', () => {
      const component = renderer.create(
        <Autocomplete
          value="fooval"
          defaultItems={defaultItems}
          items={items}
          renderTitle={() => 'my_foo_title'}
          renderItem={item => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      state.showList = true;
      component.root.instance.setState(state);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    describe('#onFocus()', () => {
      test('updates set showList state property to true', () => {
        const component = mount(
          <Autocomplete
            value="fooval"
            defaultItems={defaultItems}
            items={items}
            renderTitle={() => 'my_foo_title'}
            renderItem={item => item.label}
            getItemKey={item => item.label}
            onChange={() => {}}
            onSelect={() => {}}
          />,
        );
        expect(component.state('showList')).toBe(false);
        component.instance().onFocus({ target: { value: '' } });
        expect(component.state('showList')).toBe(true);

        // Hide the list on click on document
        document.dispatchEvent(new Event('click'));
        expect(component.state('showList')).toBe(false);

        // Verifies the listener is remove on unmount
        component.instance().onFocus({ target: { value: '' } });
        expect(component.state('showList')).toBe(true);
        component.instance().componentWillUnmount();
        document.dispatchEvent(new Event('click'));
        expect(component.state('showList')).toBe(true);
      });
    });

    describe('#onKeyPress()', () => {
      test('gives focus to the first element of the list', () => {
        const component = mount(
          <Autocomplete
            value="fooval"
            defaultItems={defaultItems}
            items={items}
            renderTitle={() => 'my_foo_title'}
            renderItem={item => item.label}
            getItemKey={item => item.label}
            onChange={() => {}}
            onSelect={() => {}}
          />,
        );
        component.find('input').simulate('keyUp', { which: 40 });
        const li = component.find('li').at(0);
        expect(li.getDOMNode()).toBe(document.activeElement);
      });
    });
  });
});
