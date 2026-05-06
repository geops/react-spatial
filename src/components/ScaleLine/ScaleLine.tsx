import OLScaleLine from "ol/control/ScaleLine";
import React, { useEffect, useRef } from "react";

import type OLMap from "ol/Map";

export interface ScaleLineProps {
  [key: string]: unknown;
  /**
   * ol/map.
   */
  map: OLMap;
  /**
   * Options for ol/control/ScaleLine.
   * See https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html
   */
  options?: Record<string, any>;
}

const defaultProps = {
  options: {},
};

/**
 * The ScaleLine component creates an
 * [ol/control/ScaleLine](https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html)
 * for an [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
 */
function ScaleLine({
  map,
  options = defaultProps.options,
  ...other
}: ScaleLineProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const control = new OLScaleLine({
      ...options,
      ...{ target: ref.current },
    });

    map.addControl(control);
    return () => {
      map.removeControl(control);
    };
  }, [map, options]);

  return <div className="rs-scale-line" ref={ref} {...other} />;
}

export default React.memo(ScaleLine);
