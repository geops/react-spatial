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
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

const defaultProps = {
  children: null,
  className: 'tm-footer',
};

/**
 * This component displays a div which stick to the bottom of a container.
 */
class Footer extends PureComponent {
  render() {
    const { children } = this.props;

    return <div {...this.props}>{children}</div>;
  }
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
