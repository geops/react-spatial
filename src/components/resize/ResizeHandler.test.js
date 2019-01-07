import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ResizeObserver from 'resize-observer-polyfill';
import ResizeHandler from './ResizeHandler';

jest.mock('resize-observer-polyfill');

configure({ adapter: new Adapter() });

// eslint-disable-next-line  react/prefer-stateless-function
class BasicComponent extends React.Component {
  render() {
    return (
      <div id="basic">
        <ResizeHandler observe={this} />
      </div>
    );
  }
}
// eslint-disable-next-line  react/prefer-stateless-function,react/no-multi-comp
class BasicComponent2 extends React.Component {
  render() {
    return (
      <div>
        <ResizeHandler observe="#basic" />
      </div>
    );
  }
}
// eslint-disable-next-line  react/prefer-stateless-function, react/no-multi-comp
class BasicComponent3 extends React.Component {
  render() {
    return (
      <div id="basic">
        <ResizeHandler
          observe={this}
          maxHeightBrkpts={{
            niedrig: 150,
            hoch: Infinity,
          }}
          maxWidthBrkpts={{
            schmal: 150,
            breit: Infinity,
          }}
        />
      </div>
    );
  }
}

describe('ResizeHandler', () => {
  describe('when observe property is not set', () => {
    test('displays an error', () => {
      window.console.error = jest.fn().mockImplementation(() => {});
      const spy = jest.spyOn(window.console, 'error');
      const wrapper = mount(<ResizeHandler />);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
      // Test componentWillUnmount function
      wrapper.unmount();
      window.console.error.mockRestore();
    });

    test('never updates', () => {
      const comp = shallow(<ResizeHandler />);
      const shouldUpdate = comp.instance().shouldComponentUpdate({});
      expect(shouldUpdate).toBe(false);
    });
  });

  describe('when observe property is set to a React Component', () => {
    test('(un)observes it on (un)mount', () => {
      const spy = jest.spyOn(ResizeObserver.prototype, 'observe');
      const spy2 = jest.spyOn(ResizeObserver.prototype, 'unobserve');
      const wrapper = mount(<BasicComponent />);
      const basic = wrapper.getDOMNode();
      expect(spy).toHaveBeenCalledWith(basic);
      wrapper.unmount();
      expect(spy2).toHaveBeenCalledWith(basic);
      spy.mockRestore();
      spy2.mockRestore();
    });

    test('set the default css class on resize ', () => {
      const wrapper = mount(<BasicComponent />);
      const basic = wrapper.getDOMNode();

      // The mock class set the onResize property, we just have to run it to
      // simulate a resize
      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 200,
            height: 200,
          },
        },
      ]);
      expect(basic.className).toBe('tm-w-xs tm-h-xs');

      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 577,
            height: 577,
          },
        },
      ]);
      expect(basic.className).toBe('tm-w-s tm-h-s');
      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 769,
            height: 769,
          },
        },
      ]);
      expect(basic.className).toBe('tm-w-m tm-h-m');
      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 993,
            height: 993,
          },
        },
      ]);
      expect(basic.className).toBe('tm-w-l tm-h-l');
      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 1201,
            height: 1201,
          },
        },
      ]);
      expect(basic.className).toBe('tm-w-xl tm-h-xl');
    });

    test('uses user defined breakpoints', () => {
      const wrapper = mount(<BasicComponent3 />);
      const basic = wrapper.getDOMNode();

      // The mock class set the onResize property, we just have to run it to
      // simulate a resize
      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 100,
            height: 100,
          },
        },
      ]);
      expect(basic.className).toBe('tm-w-schmal tm-h-niedrig');

      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 1000,
            height: 1000,
          },
        },
      ]);
      expect(basic.className).toBe('tm-w-breit tm-h-hoch');
    });
  });

  describe('when observe property is set to a query selector', () => {
    test('(un)observes it on (un)mount', () => {
      document.querySelectorAll = jest
        .fn()
        .mockImplementation(() => ['1', '2']);
      const spy = jest.spyOn(ResizeObserver.prototype, 'observe');
      const spy2 = jest.spyOn(ResizeObserver.prototype, 'unobserve');
      expect(spy).toHaveBeenCalledTimes(0);
      const wrapper = mount(<BasicComponent2 />);
      expect(spy).toHaveBeenCalledTimes(2);
      wrapper.unmount();
      expect(spy2).toHaveBeenCalledTimes(2);
      document.querySelectorAll.mockRestore();
    });
  });
});
