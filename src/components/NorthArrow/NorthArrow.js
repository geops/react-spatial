import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { unByKey } from 'ol/Observable';
import NorthArrowSimple from '../../images/northArrow.svg';
import NorthArrowCircle from '../../images/northArrowCircle.svg';

const propTypes = {
  /**
   * An ol map.
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

const radToDeg = rad => (rad * 360) / (Math.PI * 2);

const getRotation = (map, rotationOffset) =>
  radToDeg(map.getView().getRotation()) + rotationOffset;

/**
 * This component displays an arrow pointing the North of the map.
 */
function NorthArrow({ map, rotationOffset, circled, children, ...other }) {
  const [rotation, setRotation] = useState(rotationOffset);

  useEffect(() => {
    if (!map) {
      return null;
    }
    window.map = map;
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
