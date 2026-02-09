import { CopyrightControl } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";

const propTypes = {
  /**
   * CSS class of th root element
   */
  className: PropTypes.string,

  /**
   * Format function. Called with an array of copyrights from visible layers
   * and returns the copyright.
   */
  format: PropTypes.func,

  /**
   * A map.
   */
  map: PropTypes.instanceOf(Map).isRequired,
};

const defaultProps = {
  className: "rs-copyright",
  format: (copyrights) => {
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
}) {
  const [node, setNode] = useState(null);

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
      ref={(nod) => setNode(nod)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    />
  );
}

Copyright.propTypes = propTypes;

export default React.memo(Copyright);
