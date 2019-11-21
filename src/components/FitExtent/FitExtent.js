import React from 'react';
import PropTypes from 'prop-types';
import { FaExpand } from 'react-icons/fa';
import OLMap from 'ol/Map';

import './FitExtent.scss';

const propTypes = {
  /**
   * An ol map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * The extent to be zoomed.
   */
  extent: PropTypes.arrayOf(PropTypes.number).isRequired,

  /**
   * Title for the fitExtent button.
   */
  title: PropTypes.string,

  /**
   * CSS class of the fitExtent button.
   */
  className: PropTypes.string,

  /**
   * Children content of the fitExtent button.
   */
  children: PropTypes.node,
};

const defaultProps = {
  title: 'Fit Extent',
  className: 'rs-fit-extent',
  children: <FaExpand focusable={false} />,
};

/**
 * This component creates a button to zoom to the given extent.
 */
function FitExtent({ map, extent, title, className, children }) {
  const fit = () => {
    map.getView().cancelAnimations();
    map.getView().fit(extent, map.getSize());
  };

  return (
    <div
      className={className}
      role="button"
      title={title}
      tabIndex="0"
      onClick={fit}
      onKeyPress={e => e.which === 13 && fit()}
    >
      {children}
    </div>
  );
}

FitExtent.propTypes = propTypes;
FitExtent.defaultProps = defaultProps;

export default FitExtent;
