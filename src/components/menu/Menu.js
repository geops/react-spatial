import React from 'react';
import PropTypes from 'prop-types';

import './Menu.scss';

const propTypes = {
  children: PropTypes.array.isRequired,
};

const Menu = ({ children }) => (
  <div className="tm-menu">
    <div className="tm-menu-content">{children}</div>
  </div>
);

Menu.propTypes = propTypes;

export default Menu;
