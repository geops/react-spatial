import { toDegrees } from "ol/math";
import { unByKey } from "ol/Observable";
import React, { useEffect, useState } from "react";

import NorthArrowSimple from "../../images/northArrow.svg";
import NorthArrowCircle from "../../images/northArrowCircle.svg";

import type OLMap from "ol/Map";

export interface NorthArrowProps {
  [key: string]: any;
  /**
   *  Children content of the north arrow.
   */
  children?: React.ReactNode;
  /**
   * Display circle around the north arrow. Not used if pass children.
   */
  circled?: boolean;
  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: OLMap;
  /**
   * Rotation of the north arrow in degrees.
   */
  rotationOffset?: number;
}

const getRotation = (map: OLMap, rotationOffset: number) => {
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
}: NorthArrowProps) {
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
      {...other}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children || (circled ? <NorthArrowCircle /> : <NorthArrowSimple />)}
    </div>
  );
}

export default React.memo(NorthArrow);
