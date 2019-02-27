import React from 'react';
import PropTypes from 'prop-types';

import './MenuItem.scss';

const propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

const MenuItem = ({ children, title }) => (
  <>
    <div className="tm-menu-item-title">{title}</div>
    <div className="tm-menu-item">{children}</div>
  </>
);

MenuItem.propTypes = propTypes;

export default MenuItem;
