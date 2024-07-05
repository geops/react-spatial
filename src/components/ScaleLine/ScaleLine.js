import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import OLScaleLine from "ol/control/ScaleLine";
import OLMap from "ol/Map";

const propTypes = {
  /**
   * ol/map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Options for ol/control/ScaleLine.
   * See https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html
   */
  options: PropTypes.object,
};

const defaultProps = {
  options: {},
};

/**
 * The ScaleLine component creates an
 * [ol/control/ScaleLine](https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html)
 * for an [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
 */
function ScaleLine({ map, options = defaultProps.options, ...other }) {
  const ref = useRef();

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

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <div className="rs-scale-line" ref={ref} {...other} />;
}

ScaleLine.propTypes = propTypes;

export default React.memo(ScaleLine);
