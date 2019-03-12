import React from 'react';
import PropTypes from 'prop-types';

import ShareMenu from '../ShareMenu';

const propTypes = {
  className: PropTypes.string,
  defaultMenuName: PropTypes.oneOf(['share']),
  element: PropTypes.element,
};

const defaultProps = {
  className: 'tm-menu-item',
  defaultMenuName: null,
  element: null,
};

const MenuItem = ({ className, defaultMenuName, element }) => {
  let elem = null;

  switch (defaultMenuName) {
    case 'share':
      elem = <ShareMenu />;
      break;
    default:
      elem = element;
  }

  return <div className={className}>{elem}</div>;
};

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem;
