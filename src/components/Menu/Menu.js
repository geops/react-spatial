import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  classNameContent: PropTypes.string,
};

const defaultProps = {
  className: 'tm-menu',
  classNameContent: 'tm-menu-content',
};

const Menu = ({ children, className, classNameContent }) => (
  <div className={className}>
    <div className={classNameContent}>{children}</div>
  </div>
);

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

export default Menu;
