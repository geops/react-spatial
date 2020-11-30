import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { unByKey } from 'ol/Observable';
import degrees from 'radians-degrees';
import NorthArrowSimple from '../../images/northArrow.svg';
import NorthArrowCircle from '../../images/northArrowCircle.svg';

const propTypes = {
  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Rotation of the north arrow in degrees.
   */
  rotationOffset: PropTypes.number,

  /**
   * Display circle around the north arrow. Not used if pass children.
   */
  circled: PropTypes.bool,

  /**
   *  Children content of the north arrow.
   */
  children: PropTypes.node,
};

const defaultProps = {
  rotationOffset: 0,
  circled: false,
  children: null,
};

const getRotation = (map, rotationOffset) =>
  degrees(map.getView().getRotation()) + rotationOffset;

/**
 * This NorthArrow component inserts an arrow pointing North into an
 * [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
 */
function NorthArrow({ map, rotationOffset, circled, children, ...other }) {
  const [rotation, setRotation] = useState(rotationOffset);

  useEffect(() => {
    if (!map) {
      return null;
    }
    const key = map.on('postrender', () => {
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
NorthArrow.defaultProps = defaultProps;

export default React.memo(NorthArrow);
