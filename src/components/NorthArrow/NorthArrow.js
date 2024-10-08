import OLMap from "ol/Map";
import { toDegrees } from "ol/math";
import { unByKey } from "ol/Observable";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import NorthArrowSimple from "../../images/northArrow.svg";
import NorthArrowCircle from "../../images/northArrowCircle.svg";

const propTypes = {
  /**
   *  Children content of the north arrow.
   */
  children: PropTypes.node,

  /**
   * Display circle around the north arrow. Not used if pass children.
   */
  circled: PropTypes.bool,

  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Rotation of the north arrow in degrees.
   */
  rotationOffset: PropTypes.number,
};

const getRotation = (map, rotationOffset) => {
  return toDegrees(map.getView().getRotation()) + rotationOffset;
};

/**
 * This NorthArrow component inserts an arrow pointing north into an
 * [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
 */
function NorthArrow({
  children = null,
  circled = false,
  map,
  rotationOffset = 0,
  ...other
}) {
  const [rotation, setRotation] = useState(rotationOffset);

  useEffect(() => {
    if (!map) {
      return null;
    }
    const key = map.on("postrender", () => {
      setRotation(getRotation(map, rotationOffset));
    });
    return () => {
      unByKey(key);
    };
  }, [map, rotationOffset]);

  return (
    <div
      className="rs-north-arrow"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children || (circled ? <NorthArrowCircle /> : <NorthArrowSimple />)}
    </div>
  );
}

NorthArrow.propTypes = propTypes;

export default React.memo(NorthArrow);
