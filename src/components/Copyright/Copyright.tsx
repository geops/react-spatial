import { CopyrightControl } from "mobility-toolbox-js/ol";
import React, { useEffect, useMemo, useState } from "react";

import type { Map } from "ol";

export interface CopyrightProps {
  [key: string]: any;
  /**
   * CSS class of th root element
   */
  className?: string;
  /**
   * Format function. Called with an array of copyrights from visible layers
   * and returns the copyright.
   */
  format?: (copyrights: string[]) => string;
  /**
   * A map.
   */
  map: Map;
}

const defaultProps = {
  className: "rs-copyright",
  format: (copyrights: string[]) => {
    return copyrights.join(" | ");
  },
};

/**
 * The Copyright component uses the
 * [mobility-toolbox-js CopyrightControl](https://mobility-toolbox-js.geops.io/api/class/src/mapbox/controls/CopyrightControl%20js~CopyrightControl%20html-offset-anchor)
 * to render the layer copyrights.
 */
function Copyright({
  className = defaultProps.className,
  format = defaultProps.format,
  map,
  ...other
}: CopyrightProps) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const control = useMemo(() => {
    if (!node) {
      return null;
    }
    return new CopyrightControl({
      element: document.createElement("div"),
      format,
      target: node,
    });
  }, [node, format]);

  // Ensure the control is not associated to the wrong map
  useEffect(() => {
    if (!control) {
      return () => {};
    }

    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map, control]);

  return (
    <div
      className={className}
      ref={(nod) => {
        setNode(nod);
      }}
      {...other}
    />
  );
}

export default React.memo(Copyright);
