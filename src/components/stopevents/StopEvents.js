import ReactDOM from 'react-dom';
import { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * HTML element to observe.
   *
   * Can be React.Component or a CSS selector manageable by
   * document.querySelectorAll;
   *
   */
  observe: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Component),
    PropTypes.instanceOf(HTMLElement),
  ]),

  /**
   * List of user events to stop the propagation.
   */
  events: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  observe: null,
  events: [
    'pointerdown',
    'pointermove',
    'pointerup',
    'keypress',
    'keydown',
    'keyup',
  ],
};

/**
 * This component stop propagation of user events on an HTML element.
 */
class StopEvents extends PureComponent {
  static stop(evt) {
    evt.stopPropagation();
    if (evt.nativeEvent) {
      evt.nativeEvent.stopImmediatePropagation();
    }
    document.body.classList.remove('tm-pointer');
  }

  constructor(props) {
    super(props);
    this.nodes = [];
  }

  componentDidMount() {
    this.updateNodes();
    this.addListeners();
  }

  componentDidUpdate(prevProps) {
    const { observe } = this.props;
    if (observe && !prevProps.observe) {
      this.removeListeners();
      this.updateNodes();
      this.addListeners();
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners() {
    const { events } = this.props;

    if (!this.nodes.length) {
      return;
    }

    this.nodes.forEach((node) => {
      events.forEach((evt) => {
        node.addEventListener(evt, StopEvents.stop);
      });
    });
  }

  removeListeners() {
    const { events } = this.props;
    if (!this.nodes.length) {
      return;
    }

    this.nodes.forEach((node) => {
      events.forEach((evt) => {
        node.removeEventListener(evt, StopEvents.stop);
      });
    });
  }

  updateNodes() {
    const { observe } = this.props;
    this.nodes = [];
    if (typeof observe === 'string' || observe instanceof String) {
      this.nodes = document.querySelectorAll(observe);
    } else if (observe instanceof Component) {
      // eslint-disable-next-line react/no-find-dom-node
      const node = ReactDOM.findDOMNode(observe);
      if (node instanceof HTMLElement) {
        this.nodes.push(node);
      }
    } else if (observe instanceof HTMLElement) {
      this.nodes.push(observe);
    }
  }

  render() {
    return null;
  }
}

StopEvents.propTypes = propTypes;
StopEvents.defaultProps = defaultProps;

export default StopEvents;
