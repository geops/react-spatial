import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /** Open or close the  */
  className: PropTypes.string,
  children: PropTypes.node,
};

const defaultProps = {
  className: 'tm-tabs-item',
  children: null,
};

const TabItem = () => {
  return <li>Hello World</li>;
};

export default TabItem;
