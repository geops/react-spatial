import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * CSS class for the container.
   */
  className: PropTypes.string,

  /**
   * CSS class for the left div.
   */
  classNameLeft: PropTypes.string,

  /**
   * CSS class for the right div.
   */
  classNameRight: PropTypes.string,

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
  classNameLeft: 'tm-footer-left',
  classNameRight: 'tm-footer-right',
  left: undefined,
  right: undefined,
};

/**
 * This component displays a div which stick to the bottom of a container.
 */
class Footer extends PureComponent {
  render() {
    const {
      children,
      className,
      classNameLeft,
      classNameRight,
      left,
      right,
    } = this.props;
    const lElem = left ? <div className={classNameLeft}>{left}</div> : null;
    const rElem = right ? <div className={classNameRight}>{right}</div> : null;

    return (
      <div className={className}>
        {lElem}
        {children}
        {rElem}
      </div>
    );
  }
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
