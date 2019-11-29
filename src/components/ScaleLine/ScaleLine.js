import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import OLScaleLine from 'ol/control/ScaleLine';
import OLMap from 'ol/Map';

const propTypes = {
  /**
   * Openlayers map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Options for ol/control/ScaleLine.
   * See https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html
   */
  options: PropTypes.shape(),
};

const defaultProps = {
  options: {},
};

function ScaleLine({ map, options, ...other }) {
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
  }, [map]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <div className="rs-scale-line" ref={ref} {...other} />;
}

ScaleLine.propTypes = propTypes;
ScaleLine.defaultProps = defaultProps;

export default React.memo(ScaleLine);
