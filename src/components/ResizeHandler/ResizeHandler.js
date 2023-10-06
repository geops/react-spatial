import ReactDOM from "react-dom";
import { PureComponent, Component } from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";

const propTypes = {
  observe: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.instanceOf(Component),
    PropTypes.shape({ current: PropTypes.node }),
    PropTypes.shape({ current: PropTypes.instanceOf(Component) }),
  ]),
  maxHeightBrkpts: PropTypes.objectOf(PropTypes.number),
  maxWidthBrkpts: PropTypes.objectOf(PropTypes.number),
  stylePropHeight: PropTypes.string,
  onResize: PropTypes.func,

  // This property is used to re-apply the classes, for example when the className of the observed node changes.
  forceUpdate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

// Same as bootstrap
const defaultProps = {
  observe: null,
  maxHeightBrkpts: {
    xs: 576,
    s: 768,
    m: 992,
    l: 1200,
    xl: Infinity,
  },
  maxWidthBrkpts: {
    xs: 576,
    s: 768,
    m: 992,
    l: 1200,
    xl: Infinity,
  },
  stylePropHeight: null,
  onResize: null,
  forceUpdate: null,
};
/**
 * This component adds css class to an element depending on his size.
 */
class ResizeHandler extends PureComponent {
  static applyBreakpoints(entry, breakpoints, size, direction) {
    let found = false;
    let screenSize;
    Object.entries(breakpoints).forEach((brkpt) => {
      const cssClass = `rs-${direction}-${brkpt[0]}`;
      entry.target.classList.remove(cssClass);
      if (!found && size <= brkpt[1]) {
        found = true;
        [screenSize] = brkpt;
        entry.target.classList.add(cssClass);
      }
    });
    return screenSize;
  }

  constructor(props) {
    super(props);
    this.observer = new ResizeObserver((entries) => {
      return this.onResize(entries);
    });
    this.nodes = [];
  }

  componentDidMount() {
    this.observe();
  }

  componentDidUpdate(prevProps) {
    const { observe, forceUpdate } = this.props;

    if (
      observe !== prevProps.observe ||
      forceUpdate !== prevProps.forceUpdate
    ) {
      this.observe();
    }
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  onResize(entries) {
    const { maxHeightBrkpts, maxWidthBrkpts, stylePropHeight, onResize } =
      this.props;

    if (stylePropHeight) {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty(stylePropHeight, `${vh}px`);
    }

    if (!maxWidthBrkpts && !maxHeightBrkpts) {
      onResize(entries);
      return;
    }

    let newScreenWidth;
    let newScreenHeight;

    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      const rect = entry.contentRect;
      const { height, width } = rect;

      if (maxWidthBrkpts) {
        newScreenWidth = ResizeHandler.applyBreakpoints(
          entry,
          maxWidthBrkpts,
          width,
          "w",
        );
      }
      if (maxHeightBrkpts) {
        newScreenHeight = ResizeHandler.applyBreakpoints(
          entry,
          maxHeightBrkpts,
          height,
          "h",
        );
      }
    }

    if (onResize) {
      onResize(entries, newScreenWidth, newScreenHeight);
    }
  }

  observe() {
    this.observer.disconnect();
    const { observe } = this.props;

    if (!observe) {
      return;
    }

    if (typeof observe === "string" || observe instanceof String) {
      this.nodes = document.querySelectorAll(observe);
    } else if (observe instanceof Component) {
      // eslint-disable-next-line react/no-find-dom-node
      this.nodes.push(ReactDOM.findDOMNode(observe));
    } else if (observe instanceof Element) {
      this.nodes.push(observe);
    } else if (observe.current instanceof Element) {
      // observe value created with React.createRef() on a html node.
      this.nodes.push(observe.current);
    } else if (observe.current instanceof Component) {
      // observe value created with React.createRef() on a React component.
      // eslint-disable-next-line react/no-find-dom-node
      this.nodes.push(ReactDOM.findDOMNode(observe.current));
    }

    if (this.nodes.length) {
      this.nodes.forEach((node) => {
        return this.observer.observe(node);
      });
    }
  }

  render() {
    return null;
  }
}

ResizeHandler.propTypes = propTypes;
ResizeHandler.defaultProps = defaultProps;

export default ResizeHandler;
