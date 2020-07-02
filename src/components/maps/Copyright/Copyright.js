import React, { useMemo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import LayerService from '../../../LayerService';

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

  /**
   * CSS class of th root element
   */
  className: PropTypes.string,
};

const defaultProps = {
  layerService: null,
  format: (copyrights) => copyrights.join(' | '),
  className: 'rs-copyright',
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
          .filter((l) => l.visible)
          .map((l) => l.copyright)
          .filter((cr) => cr),
      ),
    ),
  );

  useEffect(() => {
    layerService.on('change:visible', forceUpdate);
    layerService.on('change:copyright', forceUpdate);
    return () => {
      layerService.un('change:visible', forceUpdate);
      layerService.un('change:copyright', forceUpdate);
    };
  }, [layerService]);

  if (!copyrights.length) {
    return null;
  }

  return (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: format(copyrights),
      }}
    />
  );
}

Copyright.propTypes = propTypes;
Copyright.defaultProps = defaultProps;

export default React.memo(Copyright);
