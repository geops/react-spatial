import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string.isRequired,
  clicked: PropTypes.func,
};

const defaultProps = {
  clicked: () => {},
};

const SidebarItem = ({ title, clicked }) => (
  <li onClick={() => clicked()}>{title}</li>
);

SidebarItem.propTypes = propTypes;
SidebarItem.defaultProps = defaultProps;

export default SidebarItem;
