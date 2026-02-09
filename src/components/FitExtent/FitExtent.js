import OLMap from "ol/Map";
import PropTypes from "prop-types";
import React from "react";

const propTypes = {
  /**
   * Button content.
   */
  children: PropTypes.node.isRequired,

  /**
   * CSS class  for the fitExtent button.
   */
  className: PropTypes.string,

  /**
   * The extent to be zoomed.
   */
  extent: PropTypes.arrayOf(PropTypes.number).isRequired,

  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: PropTypes.instanceOf(OLMap).isRequired,
};

/**
 * The FitExtent component creates a button that updates the current extent of
 * an [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
 */
function FitExtent({
  children,
  className = "rs-fit-extent",
  extent,
  map,
  ...other
}) {
  const fit = (evt) => {
    if (evt.which && evt.which !== 13) {
      return;
    }
    map.getView().cancelAnimations();
    map.getView().fit(extent, map.getSize());
  };

  return (
    <div
      className={className}
      onClick={fit}
      onKeyPress={fit}
      role="button"
      tabIndex="0"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {children}
    </div>
  );
}

FitExtent.propTypes = propTypes;

export default FitExtent;
