import ReactDOM from 'react-dom';
import { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';

const propTypes = {
  observe: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Element),
    PropTypes.instanceOf(Component),
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    PropTypes.shape({ current: PropTypes.instanceOf(Component) }),
  ]),
  maxHeightBrkpts: PropTypes.objectOf(PropTypes.number),
  maxWidthBrkpts: PropTypes.objectOf(PropTypes.number),
  stylePropHeight: PropTypes.string,
  onResize: PropTypes.func,
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
};
/**
 * This component adds css class to an element depending on his size.
 */
class ResizeHandler extends PureComponent {
  static applyBreakpoints(entry, breakpoints, size, direction) {
    let found = false;
    Object.entries(breakpoints).forEach(brkpt => {
      const cssClass = `tm-${direction}-${brkpt[0]}`;
      entry.target.classList.remove(cssClass);
      if (!found && size <= brkpt[1]) {
        found = true;
        entry.target.classList.add(cssClass);
      }
    });
  }

  constructor(props) {
    super(props);
    this.observer = new ResizeObserver(entries => this.onResize(entries));
    this.nodes = [];
  }

  componentDidMount() {
    this.observe();
  }

  componentDidUpdate(prevProps) {
    const { observe } = this.props;

    if (observe !== prevProps.observe) {
      this.observe();
    }
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  onResize(entries) {
    const {
      maxHeightBrkpts,
      maxWidthBrkpts,
      stylePropHeight,
      onResize,
    } = this.props;

    if (stylePropHeight) {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty(stylePropHeight, `${vh}px`);
    }

    if (onResize) {
      onResize(entries);
    }

    if (!maxWidthBrkpts && !maxHeightBrkpts) {
      return;
    }

    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      const rect = entry.contentRect;
      const { height, width } = rect;

      if (maxWidthBrkpts) {
        ResizeHandler.applyBreakpoints(entry, maxWidthBrkpts, width, 'w');
      }
      if (maxHeightBrkpts) {
        ResizeHandler.applyBreakpoints(entry, maxHeightBrkpts, height, 'h');
      }
    }
  }

  observe() {
    this.observer.disconnect();
    const { observe } = this.props;

    if (!observe) {
      return;
    }

    if (typeof observe === 'string' || observe instanceof String) {
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
      this.nodes.forEach(node => this.observer.observe(node));
    }
  }

  render() {
    return null;
  }
}

ResizeHandler.propTypes = propTypes;
ResizeHandler.defaultProps = defaultProps;

export default ResizeHandler;
