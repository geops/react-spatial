/* eslint-disable max-classes-per-file */
/* eslint-disable  react/no-multi-comp,react/prefer-stateless-function,react/prop-types */
import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ResizeObserver from 'resize-observer-polyfill';
import ResizeHandler from './ResizeHandler';

jest.mock('resize-observer-polyfill');

configure({ adapter: new Adapter() });

class Div extends React.Component {
  render() {
    return <div />;
  }
}

class BasicComponent extends React.Component {
  render() {
    const { onResize, stylePropHeight } = this.props;
    return (
      <div id="basic">
        <ResizeHandler
          observe={this}
          onResize={onResize}
          stylePropHeight={stylePropHeight}
        />
      </div>
    );
  }
}

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

class StrComponent extends React.Component {
  render() {
    return (
      <span id="basic">
        <ResizeHandler observe="#basic" />
      </span>
    );
  }
}

class ThisComponent extends React.Component {
  render() {
    return (
      <div>
        <ResizeHandler observe={this} />
      </div>
    );
  }
}

class RefComponent extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    return (
      <>
        <Div ref={this.ref} />
        <ResizeHandler observe={this.ref} />
      </>
    );
  }
}

class CallbackComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: null,
    };
  }

  render() {
    const { ref } = this.state;
    return (
      <>
        <div
          ref={(node) => {
            if (node && !ref) {
              this.setState({
                ref: node,
              });
            }
          }}
        />
        <ResizeHandler observe={ref} />
      </>
    );
  }
}

class RefNodeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    return (
      <>
        <div ref={this.ref} />
        <ResizeHandler observe={this.ref} />
      </>
    );
  }
}

// eslint-disable-next-line  react/prefer-stateless-function
class CallbackNodeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: null,
    };
  }

  render() {
    const { ref } = this.state;
    return (
      <>
        <div
          ref={(node) => {
            if (node && !ref) {
              this.setState({
                ref: node,
              });
            }
          }}
        />
        <ResizeHandler observe={ref} />
      </>
    );
  }
}

const comps = [
  ThisComponent,
  RefComponent,
  RefNodeComponent,
  CallbackComponent,
  CallbackNodeComponent,
];

describe('ResizeHandler', () => {
  describe('when observe property is not set', () => {
    test("doesn't observe", () => {
      const spy = jest.spyOn(ResizeObserver.prototype, 'observe');
      shallow(<ResizeHandler />);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    test('disconnect on unmount', () => {
      const wrapper = shallow(<ResizeHandler />);
      const spy = jest.spyOn(wrapper.instance().observer, 'disconnect');
      wrapper.unmount();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when observe property is set', () => {
    test('try t get  an html node from a string on (un)mount', () => {
      const div = document.createElement('div');
      document.querySelectorAll = jest.fn().mockImplementation(() => [div]);
      const spy = jest.spyOn(ResizeObserver.prototype, 'observe');
      const spy2 = jest.spyOn(ResizeObserver.prototype, 'disconnect');
      mount(<StrComponent />);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(div);
      expect(spy2.mock.calls.length >= 1).toBe(true);
      spy.mockRestore();
      spy2.mockRestore();
      document.querySelectorAll.mockRestore();
    });

    comps.forEach((Comp) => {
      test(`(un)observes an html node from ${Comp.name} on (un)mount`, () => {
        const spy = jest.spyOn(ResizeObserver.prototype, 'observe');
        const spy2 = jest.spyOn(ResizeObserver.prototype, 'disconnect');
        const wrapper = mount(<Comp />);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBeInstanceOf(Element);
        expect(spy2.mock.calls.length >= 1).toBe(true);
        ResizeObserver.prototype.observe.mockRestore();
        spy.mockRestore();
        spy2.mockRestore();
        wrapper.unmount();
      });
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
      expect(basic.className).toBe('rs-w-xs rs-h-xs');

      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 577,
            height: 577,
          },
        },
      ]);
      expect(basic.className).toBe('rs-w-s rs-h-s');
      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 769,
            height: 769,
          },
        },
      ]);
      expect(basic.className).toBe('rs-w-m rs-h-m');
      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 993,
            height: 993,
          },
        },
      ]);
      expect(basic.className).toBe('rs-w-l rs-h-l');
      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 1201,
            height: 1201,
          },
        },
      ]);
      expect(basic.className).toBe('rs-w-xl rs-h-xl');
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
      expect(basic.className).toBe('rs-w-schmal rs-h-niedrig');

      ResizeObserver.onResize([
        {
          target: basic,
          contentRect: {
            width: 1000,
            height: 1000,
          },
        },
      ]);
      expect(basic.className).toBe('rs-w-breit rs-h-hoch');
    });

    test('calls onResize property', () => {
      const fn = jest.fn();
      const wrapper = mount(<BasicComponent onResize={fn} />);
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
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('set a style property on resize', () => {
      const spy = jest.spyOn(document.documentElement.style, 'setProperty');
      const wrapper = mount(<BasicComponent stylePropHeight="foo" />);
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
      expect(spy).toHaveBeenCalledWith('foo', '7.68px');
    });
  });
});
