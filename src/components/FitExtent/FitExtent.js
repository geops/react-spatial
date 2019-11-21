import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
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
   * Button content.
   */
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  title: 'Fit Extent',
};

/**
 * This component creates a button to zoom to the given extent.
 */
function FitExtent({ map, extent, title, children, ...other }) {
  const fit = useCallback(() => {
    map.getView().cancelAnimations();
    map.getView().fit(extent, map.getSize());
  });

  return (
    <div
      className="rs-fit-extent"
      role="button"
      title={title}
      tabIndex="0"
      onClick={fit}
      onKeyPress={e => e.which === 13 && fit()}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {children}
    </div>
  );
}

FitExtent.propTypes = propTypes;
FitExtent.defaultProps = defaultProps;

export default FitExtent;
