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
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <li onClick={() => clicked()} onKeyPress={() => clicked}>
    {title}
  </li>
);

SidebarItem.propTypes = propTypes;
SidebarItem.defaultProps = defaultProps;

export default SidebarItem;
