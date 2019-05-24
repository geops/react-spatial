import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  classNameTitle: PropTypes.string,
  iconOnly: PropTypes.bool,
};

const defaultProps = {
  className: 'tm-sidebar-item',
  classNameTitle: 'tm-sidebar-item-title',
};

const SidebarItem = ({ children, title, className, classNameTitle, iconOnly }) => (
  <>
    <div className={classNameTitle}>{iconOnly ? '>>>' : title}</div>
    <div className={className}>{children}</div>
  </>
);

SidebarItem.propTypes = propTypes;
SidebarItem.defaultProps = defaultProps;

export default SidebarItem;   