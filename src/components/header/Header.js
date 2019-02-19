import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * CSS class of the container.
   */
  className: PropTypes.string,

  /**
   * CSS class of the container using float: left.
   */
  classNameLeft: PropTypes.string,

  /**
   * Element to display in a container using float:left
   */
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * Children content of the button.
   */
  children: PropTypes.node,
};

const defaultProps = {
  left: null,
  children: [],
  className: 'tm-header',
  classNameLeft: 'tm-header-left',
};

const Header = ({ className, classNameLeft, left, children }) => (
  <div className={className}>
    <div className={classNameLeft}>{left}</div>
    {children}
  </div>
);

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
