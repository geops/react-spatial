import React, { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "ol";
import { CopyrightControl } from "mobility-toolbox-js/ol";

const propTypes = {
  /**
   * A map.
   */
  map: PropTypes.instanceOf(Map).isRequired,

  /**
   * Format function. Called with an array of copyrights from visible layers
   * and returns the copyright.
   */
  format: PropTypes.func,

  /**
   * CSS class of th root element
   */
  className: PropTypes.string,
};

const defaultProps = {
  format: (copyrights) => {
    return copyrights.join(" | ");
  },
  className: "rs-copyright",
};

/**
 * The Copyright component uses the
 * [mobility-toolbox-js CopyrightControl](https://mobility-toolbox-js.geops.io/api/class/src/mapbox/controls/CopyrightControl%20js~CopyrightControl%20html-offset-anchor)
 * to render the layer copyrights.
 */
function Copyright({ map, format, ...other }) {
  const [node, setNode] = useState(null);

  const control = useMemo(() => {
    if (!node) {
      return null;
    }
    return new CopyrightControl({
      target: node,
      element: document.createElement("div"),
      format,
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
      ref={(nod) => setNode(nod)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    />
  );
}

Copyright.propTypes = propTypes;
Copyright.defaultProps = defaultProps;

export default React.memo(Copyright);
