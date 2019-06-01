import React from 'react';
import PropTypes from 'prop-types';
import List from '../List';

const propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  classNameTitle: PropTypes.string,
  text: PropTypes.string
};

const defaultProps = {
  classNameItem: 'tm-sidebar li',
  classNameTitle: 'tm-menu-item-title',
  text: 'hello'
};

const SidebarItem = ({ title, text, className, children }) => (
      <li>{text}</li>
);

SidebarItem.propTypes = propTypes;
SidebarItem.defaultProps = defaultProps;

export default SidebarItem;   