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
    <div className={className}>{title}</div>
    <div className={classNameTitle}>{children}</div>
  </>
);

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem;
