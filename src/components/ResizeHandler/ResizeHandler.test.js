/* eslint-disable max-classes-per-file */
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure, mount, shallow } from "enzyme";
/* eslint-disable  react/no-multi-comp,react/prefer-stateless-function,react/prop-types */
import React from "react";
import ResizeObserver from "resize-observer-polyfill";

import ResizeHandler from "./ResizeHandler";

jest.mock("resize-observer-polyfill");

configure({ adapter: new Adapter() });

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
          /* eslint-disable perfectionist/sort-objects */
          maxHeightBrkpts={{
            niedrig: 150,
            hoch: Infinity,
          }}
          maxWidthBrkpts={{
            schmal: 150,
            breit: Infinity,
          }}
          /* eslint-enable perfectionist/sort-objects */
          observe={this}
        />
      </div>
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

class StrComponent extends React.Component {
  render() {
    return (
      <span id="basic">
        <ResizeHandler observe="#basic" />
      </span>
    );
  }
}

const comps = [RefNodeComponent, CallbackComponent, CallbackNodeComponent];

describe("ResizeHandler", () => {
  describe("when observe property is not set", () => {
    test("doesn't observe", () => {
      const spy = jest.spyOn(ResizeObserver.prototype, "observe");
      shallow(<ResizeHandler />);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    test("disconnect on unmount", () => {
      const wrapper = shallow(<ResizeHandler />);
      const spy = jest.spyOn(wrapper.instance().observer, "disconnect");
      wrapper.unmount();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when observe property is set", () => {
    test("try t get  an html node from a string on (un)mount", () => {
      const div = document.createElement("div");
      document.querySelectorAll = jest.fn().mockImplementation(() => {
        return [div];
      });
      const spy = jest.spyOn(ResizeObserver.prototype, "observe");
      const spy2 = jest.spyOn(ResizeObserver.prototype, "disconnect");
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
        const spy = jest.spyOn(ResizeObserver.prototype, "observe");
        const spy2 = jest.spyOn(ResizeObserver.prototype, "disconnect");
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

    test("set the default css class on resize ", () => {
      const wrapper = mount(<BasicComponent />);
      const basic = wrapper.getDOMNode();

      // The mock class set the onResize property, we just have to run it to
      // simulate a resize
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 200,
            width: 200,
          },
          target: basic,
        },
      ]);
      expect(basic.className).toBe("rs-w-xs rs-h-xs");

      ResizeObserver.onResize([
        {
          contentRect: {
            height: 577,
            width: 577,
          },
          target: basic,
        },
      ]);
      expect(basic.className).toBe("rs-w-s rs-h-s");
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 769,
            width: 769,
          },
          target: basic,
        },
      ]);
      expect(basic.className).toBe("rs-w-m rs-h-m");
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 993,
            width: 993,
          },
          target: basic,
        },
      ]);
      expect(basic.className).toBe("rs-w-l rs-h-l");
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 1201,
            width: 1201,
          },
          target: basic,
        },
      ]);
      expect(basic.className).toBe("rs-w-xl rs-h-xl");
    });

    test("uses user defined breakpoints", () => {
      const wrapper = mount(<BasicComponent3 />);
      const basic = wrapper.getDOMNode();

      // The mock class set the onResize property, we just have to run it to
      // simulate a resize
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 100,
            width: 100,
          },
          target: basic,
        },
      ]);
      expect(basic.className).toBe("rs-w-schmal rs-h-niedrig");

      ResizeObserver.onResize([
        {
          contentRect: {
            height: 1000,
            width: 1000,
          },
          target: basic,
        },
      ]);
      expect(basic.className).toBe("rs-w-breit rs-h-hoch");
    });

    test("calls onResize property", () => {
      const fn = jest.fn();
      const wrapper = mount(<BasicComponent onResize={fn} />);
      const basic = wrapper.getDOMNode();

      // The mock class set the onResize property, we just have to run it to
      // simulate a resize
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 100,
            width: 100,
          },
          target: basic,
        },
      ]);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("set a style property on resize", () => {
      const spy = jest.spyOn(document.documentElement.style, "setProperty");
      const wrapper = mount(<BasicComponent stylePropHeight="foo" />);
      const basic = wrapper.getDOMNode();

      // The mock class set the onResize property, we just have to run it to
      // simulate a resize
      ResizeObserver.onResize([
        {
          contentRect: {
            height: 100,
            width: 100,
          },
          target: basic,
        },
      ]);
      expect(spy).toHaveBeenCalledWith("foo", "7.68px");
    });
  });
});
