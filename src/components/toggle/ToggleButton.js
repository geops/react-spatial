import React, { PureComponent, Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

import './ToggleButton.scss';

const propTypes = {
  /**
   * Define the status of the toggle open or not.
   */
  open: PropTypes.bool,

  /**
   * HTML element to toggle display.
   */
  target: PropTypes.instanceOf(Element),

  /**
   * Function triggered when the toogle target is shown or hidden (after the end
   * of the animation).
   */
  onToggle: PropTypes.func,

  /**
   * A React element to display when the HTML element is opened.
   */
  openComponent: PropTypes.element,

  /**
   * A React element to display when the HTML element is closed.
   */
  closeComponent: PropTypes.element,

  /**
   * Define an element that should be focused in 'target' prop.
   */
  focusTarget: PropTypes.string,

  /**
   * String that is passed to aria-label param.
   * https://www.w3.org/TR/wai-aria/#aria-label
   */
  ariaLabel: PropTypes.string.isRequired,
};

const defaultProps = {
  target: null,
  open: false,
  onToggle: () => {},
  openComponent: <MdArrowDropDown focusable={false} />,
  closeComponent: <MdArrowDropUp focusable={false} />,
  focusTarget: null,
};

/**
 * This component displays a simple a button that toggle the display of an HTML
 * element.
 *
 * Basically it adds CSS classes to the HTMl element.
 * It adds `tm-close` when the target is closing or closed and `tm-hidden` after
 * 300 ms.
 * When the target is opening or opened these 2 classes are removed.
 */
class ToggleButton extends PureComponent {
  componentDidMount() {
    const { target } = this.props;

    if (target) {
      this.updateTarget();
    }
  }

  componentDidUpdate(prevProps) {
    const { target, open } = this.props;

    if (target && prevProps.open !== open) {
      this.updateTarget();
    }
  }

  /**
   * Toggle the target and hide it after a small delay
   * for accessibility (hidden elements are reachable by tab).
   * Use a delay for animation.
   */
  updateTarget() {
    const { target, focusTarget, open } = this.props;

    window.clearTimeout(this.openTimeout);
    window.clearTimeout(this.closeTimeout);

    if (open) {
      target.classList.remove('tm-hidden');
      this.openTimeout = window.setTimeout(() => {
        target.classList.remove('tm-close');

        if (focusTarget) {
          let node = target;
          if (node instanceof Component) {
            // eslint-disable-next-line react/no-find-dom-node
            node = ReactDOM.findDOMNode(node);
          }
          if (node instanceof HTMLElement && node.querySelector(focusTarget)) {
            // Focus automatically first element
            node.querySelector(focusTarget).focus();
          }
        }
      }, 10);
    } else {
      target.classList.add('tm-close');
      this.closeTimeout = window.setTimeout(() => {
        target.classList.add('tm-hidden');
      }, 300);
    }
  }

  render() {
    const {
      openComponent,
      closeComponent,
      ariaLabel,
      open,
      onToggle,
    } = this.props;
    const menuButton = open ? closeComponent : openComponent;

    return (
      <div
        className="tm-toggle-button"
        role="button"
        tabIndex="0"
        aria-label={ariaLabel}
        onClick={() => onToggle(!open)}
        onKeyPress={e => e.which === 13 && onToggle(!open)}
      >
        {menuButton}
      </div>
    );
  }
}

ToggleButton.propTypes = propTypes;
ToggleButton.defaultProps = defaultProps;

export default ToggleButton;
