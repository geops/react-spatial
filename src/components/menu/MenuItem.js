import React from 'react';
import PropTypes from 'prop-types';

import ShareMenu from './ShareMenu';

import './MenuItem.scss';

const propTypes = {
  defaultMenuName: PropTypes.oneOf(['share']),
  element: PropTypes.element,
};

const defaultProps = {
  defaultMenuName: null,
  element: null,
};

const MenuItem = ({ defaultMenuName, element }) => {
  let elem = null;

  switch (defaultMenuName) {
    case 'share':
      elem = <ShareMenu />;
      break;
    default:
      elem = element;
  }

  return (
    <div className="tm-menu-item">
      { elem }
    </div>
  );
};

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem;
