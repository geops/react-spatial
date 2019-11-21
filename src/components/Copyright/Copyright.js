import React, { useMemo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Layer from '../../layers/Layer';

const propTypes = {
  /**
   * Set of react-spatial layers.
   */
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),

  /**
   * Format function. Called with an array of copyrights from visible layers
   * and returns the copyright.
   */
  format: PropTypes.func,
};

const defaultProps = {
  layers: [],
  format: copyrights => (
    <>
      &copy;
      {` ${copyrights.join(' | ')}`}
    </>
  ),
};

function Copyright({ layers, format, ...other }) {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const copyrights = useMemo(() =>
    // Array.from(new Set()) is use to remove duplicates.
    Array.from(
      new Set(layers.filter(l => l.getVisible()).map(l => l.getCopyright())),
    ),
  );

  useEffect(() => {
    layers.forEach(layer => {
      layer.on('change:visible', forceUpdate);
    });
    return () => {
      layers.forEach(layer => {
        layer.un('change:visible', forceUpdate);
      });
    };
  }, [layers]);

  if (!copyrights.length) {
    return null;
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="rs-copyright" {...other}>
      {format(copyrights)}
    </div>
  );
}

Copyright.propTypes = propTypes;
Copyright.defaultProps = defaultProps;

export default React.memo(Copyright);
