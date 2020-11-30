import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';

const propTypes = {
  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * The extent to be zoomed.
   */
  extent: PropTypes.arrayOf(PropTypes.number).isRequired,

  /**
   * CSS class  for the fitExtent button.
   */
  className: PropTypes.string,

  /**
   * Button content.
   */
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  className: 'rs-fit-extent',
};

/**
 * This component creates a button that updates the current extent of
 * an [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
 */
function FitExtent({ map, extent, className, children, ...other }) {
  const fit = useCallback((evt) => {
    if (evt.which && evt.which !== 13) {
      return;
    }
    map.getView().cancelAnimations();
    map.getView().fit(extent, map.getSize());
  });

  return (
    <div
      className={className}
      role="button"
      tabIndex="0"
      onClick={fit}
      onKeyPress={fit}
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
