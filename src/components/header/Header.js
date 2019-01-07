import React from 'react';
import PropTypes from 'prop-types';

import './Header.scss';

const propTypes = {
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * Children content of the button.
   */
  children: PropTypes.node,
};

const defaultProps = {
  left: null,
  children: [],
};

const Header = ({ left, children }) => (
  <div className="tm-header">
    <div className="tm-header-left">{left}</div>
    {children}
  </div>
);

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
