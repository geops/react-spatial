import ReactDOM from 'react-dom';
import { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';

const propTypes = {
  observe: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Component),
  ]).isRequired,
  maxHeightBrkpts: PropTypes.objectOf(PropTypes.number),
  maxWidthBrkpts: PropTypes.objectOf(PropTypes.number),
  stylePropHeight: PropTypes.string,
};

// Same as bootstrap
const defaultProps = {
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
};
/**
 * This component adds css class to an element depending on his size.
 */
class ResizeHandler extends Component {
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
    const { observe } = this.props;
    if (typeof observe === 'string' || observe instanceof String) {
      this.nodes = document.querySelectorAll(observe);
    } else if (observe instanceof Component) {
      // eslint-disable-next-line react/no-find-dom-node
      this.nodes.push(ReactDOM.findDOMNode(observe));
    }

    if (this.nodes.length) {
      this.nodes.forEach(node => this.observer.observe(node));
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (this.nodes.length) {
      this.nodes.forEach(node => this.observer.unobserve(node));
    }
  }

  onResize(entries) {
    const { maxHeightBrkpts, maxWidthBrkpts, stylePropHeight } = this.props;
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
    if (stylePropHeight) {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty(stylePropHeight, `${vh}px`);
    }
  }

  render() {
    return null;
  }
}

ResizeHandler.propTypes = propTypes;
ResizeHandler.defaultProps = defaultProps;

export default ResizeHandler;
