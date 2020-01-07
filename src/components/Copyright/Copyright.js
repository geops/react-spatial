import React, { useMemo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import LayerService from '../../LayerService';

const propTypes = {
  /**
   * A LayerService.
   */
  layerService: PropTypes.instanceOf(LayerService),

  /**
   * Format function. Called with an array of copyrights from visible layers
   * and returns the copyright.
   */
  format: PropTypes.func,
};

const defaultProps = {
  layerService: null,
  format: copyrights => (
    <>
      &copy;
      {` ${copyrights.join(' | ')}`}
    </>
  ),
};

function Copyright({ layerService, format, ...other }) {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const copyrights = useMemo(() =>
    // Array.from(new Set()) is use to remove duplicates.
    Array.from(
      new Set(
        layerService
          .getLayersAsFlatArray()
          .filter(l => l.getVisible())
          .map(l => l.getCopyright())
          .filter(cr => cr !== undefined),
      ),
    ),
  );

  useEffect(() => {
    layerService.on('change:visible', forceUpdate);
    return () => {
      layerService.un('change:visible', forceUpdate);
    };
  }, [layerService]);

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
