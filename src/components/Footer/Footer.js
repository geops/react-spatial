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
};

const defaultProps = {
  children: undefined,
  className: 'tm-footer',
};

/**
 * This component displays a div which stick to the bottom of a container.
 */
class Footer extends PureComponent {
  render() {
    const { children, className } = this.props;

    return <div className={className}>{children}</div>;
  }
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
