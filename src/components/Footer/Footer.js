import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * CSS class of the button.
   */
  className: PropTypes.string,

  /**
   * Element to display in a container.
   */
  children: PropTypes.node,

  /**
   * Element displayed on the left side of the footer
   */
  left: PropTypes.node,

  /**
   * Element displayed on the right side of the footer
   */
  right: PropTypes.node,
};

const defaultProps = {
  children: undefined,
  className: 'tm-footer',
  left: undefined,
  right: undefined,
};

/**
 * This component displays a div which stick to the bottom of a container.
 */
class Footer extends PureComponent {
  render() {
    const { children, className, left, right } = this.props;
    const lElem = left ? <div className="tm-footer-left">{left}</div> : null;
    const rElem = right ? <div className="tm-footer-right">{right}</div> : null;

    return (
      <div className={className}>
        {lElem}
        <div className="tm-footer-content">{children}</div>
        {rElem}
      </div>
    );
  }
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
