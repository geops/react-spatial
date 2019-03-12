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

const mountDflt = () => {
  return mount(
    <Autocomplete
      value="fooval"
      defaultItems={defaultItems}
      items={items}
      renderItem={item => item.label}
      getItemKey={item => item.label}
    />,
  );
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
    test('should match snapshot without items and defaultItems using defaultProps', () => {
      const component = renderer.create(<Autocomplete value="fooval" />);
      state.showList = true;
      component.root.instance.setState(state);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot without items and defaultItems', () => {
      const component = renderer.create(
        <Autocomplete
          value="fooval"
          renderTitle={() => 'my_foo_title'}
          renderItem={item => item.label}
          getItemKey={() => Math.random()}
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

    describe('#onDocClick()', () => {
      test('hide the list and removes the focus.', () => {
        const component = mountDflt();
        component.setState({
          showList: true,
          focus: true,
        });
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);

        // Hide the list on click on document
        document.dispatchEvent(new Event('click'));
        expect(component.state('showList')).toBe(false);
        expect(component.state('focus')).toBe(false);
      });

      test('does nothing when click comes from ana element of Autocomplete.', () => {
        const component = mountDflt();
        component.setState({
          showList: true,
          focus: true,
        });
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);
        component.instance().onDocClick({
          target: component
            .find('div')
            .at(0)
            .getDOMNode(),
        });
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);
      });
    });

    describe('#onFocus()', () => {
      test('updates set showList state property to true', () => {
        const component = mountDflt();
        expect(component.state('showList')).toBe(false);
        expect(component.state('focus')).toBe(false);
        component.find('input').simulate('focus', { target: { value: '' } });
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);

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

    describe('#onBlurInput()', () => {
      test('does nothing if no lastKeyPress parameter', () => {
        const component = mountDflt();
        component.setState({
          showList: true,
          focus: true,
        });
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);
        component.find('input').simulate('blur');
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);
      });

      test('hide list and renove focus if lastKeyPress is not an arrow down.', () => {
        const component = mountDflt();
        component.setState({
          showList: true,
          focus: true,
        });
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);
        component.instance().onBlurInput({}, { which: 41 });
        expect(component.state('showList')).toBe(false);
        expect(component.state('focus')).toBe(false);
      });
    });

    describe('#onKeyPress()', () => {
      test('gives focus to the first element of the list', () => {
        const component = mountDflt();
        component.find('input').simulate('keyup', { which: 40 });
        const li = component.find('li').at(0);
        expect(li.getDOMNode()).toBe(document.activeElement);
      });

      test("doesn't give focus to the first element of the list", () => {
        const component = mountDflt();
        component.find('input').simulate('keyup', { which: 41 });
        const li = component.find('li').at(0);
        expect(li.getDOMNode()).not.toBe(document.activeElement);
      });
    });

    describe('#onKeyPressItem()', () => {
      test('does nothing when another key than arrows is pressed.', () => {
        const component = mountDflt();
        const li = component.find('li').at(1);
        li.getDOMNode().focus();
        li.simulate('keydown', { which: 39 });
        expect(li.getDOMNode()).toBe(document.activeElement);
      });

      test('moves focus to search input.', () => {
        const component = mountDflt();
        const li = component.find('li').at(0);
        li.getDOMNode().focus();
        li.simulate('keydown', { which: 38 });
        expect(component.find('input').getDOMNode()).toBe(
          document.activeElement,
        );
      });

      test('moves focus to previous item.', () => {
        const component = mountDflt();
        const lis = component.find('li');
        const li = lis.at(1);
        li.getDOMNode().focus();
        li.simulate('keydown', { which: 38 });
        expect(lis.at(0).getDOMNode()).toBe(document.activeElement);
      });

      test('moves focus to next item.', () => {
        const component = mountDflt();
        const lis = component.find('li');
        const li = lis.at(1);
        li.getDOMNode().focus();
        li.simulate('keydown', { which: 40 });
        expect(lis.at(2).getDOMNode()).toBe(document.activeElement);
      });

      test('moves focus to default items.', () => {
        const component = mountDflt();
        const lis = component.find('li');
        const li = lis.at(2);
        li.getDOMNode().focus();
        li.simulate('keydown', { which: 40 });
        expect(lis.at(3).getDOMNode()).toBe(document.activeElement);
      });

      test('moves focus to the beginning of the list.', () => {
        const component = mountDflt();
        const lis = component.find('li');
        const li = lis.at(5);
        li.getDOMNode().focus();
        li.simulate('keydown', { which: 40 });
        expect(lis.at(0).getDOMNode()).toBe(document.activeElement);
      });
    });

    describe('#onSelect()', () => {
      test('hide list and remove focus when select an item.', () => {
        const fn = jest.fn();
        const component = mount(
          <Autocomplete
            value="fooval"
            defaultItems={defaultItems}
            items={items}
            renderItem={item => item.label}
            getItemKey={item => item.label}
            onSelect={fn}
          />,
        );
        component.setState({
          showList: true,
          focus: true,
        });
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);
        component
          .find('li')
          .at(0)
          .simulate('click', {});
        expect(component.state('showList')).toBe(false);
        expect(component.state('focus')).toBe(false);
        expect(fn).toBeCalledTimes(1);
      });

      test('hide list and remove focus when select on default item.', () => {
        const fn = jest.fn();
        const component = mount(
          <Autocomplete
            value="fooval"
            defaultItems={defaultItems}
            items={items}
            renderItem={item => item.label}
            getItemKey={item => item.label}
            onSelect={fn}
          />,
        );
        component.setState({
          showList: true,
          focus: true,
        });
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);
        component
          .find('li')
          .at(4)
          .simulate('click', {});
        expect(component.state('showList')).toBe(false);
        expect(component.state('focus')).toBe(false);
        expect(fn).toBeCalledTimes(1);
      });
    });

    describe('#onChange()', () => {
      test('gives focus to the input and display the list.', () => {
        const fn = jest.fn();
        const component = mount(
          <Autocomplete
            value="fooval"
            defaultItems={defaultItems}
            items={items}
            renderItem={item => item.label}
            getItemKey={item => item.label}
            onChange={fn}
          />,
        );
        expect(component.state('showList')).toBe(false);
        expect(component.state('focus')).toBe(false);
        component.find('input').simulate('change', {});
        expect(component.state('showList')).toBe(true);
        expect(component.state('focus')).toBe(true);
        expect(fn).toBeCalledTimes(1);
      });
    });

    test('hides the list on click on search button if the list is open.', () => {
      const component = mountDflt();
      component.setState({
        showList: true,
        focus: true,
      });
      expect(component.state('showList')).toBe(true);
      expect(component.state('focus')).toBe(true);
      component
        .find('[role="button"]')
        .at(1)
        .simulate('click', {});
      expect(component.state('showList')).toBe(false);
      expect(component.state('focus')).toBe(false);
    });
  });
});
