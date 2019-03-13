import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  classNameTitle: PropTypes.string,
};

const defaultProps = {
  className: 'tm-menu-item',
  classNameTitle: 'tm-menu-item-title',
};

const MenuItem = ({ children, title, className, classNameTitle }) => (
  <>
    <div className={classNameTitle}>{title}</div>
    <div className={className}>{children}</div>
  </>
);

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem;
