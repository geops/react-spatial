import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'ol';
import CopyrightControl from 'mobility-toolbox-js/ol/controls/CopyrightControl';

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
  format: (copyrights) => copyrights.join(' | '),
  className: 'rs-copyright',
};

function Copyright({ map, format, ...other }) {
  const [copyrights, setCopyrights] = useState([]);

  const control = useMemo(() => {
    return new CopyrightControl({
      target: document.createElement('div'),
      element: document.createElement('div'),
      render() {
        // eslint-disable-next-line react/no-this-in-sfc
        const newCopyrights = this.getCopyrights();
        if (copyrights.toString() !== newCopyrights.toString()) {
          setCopyrights(newCopyrights);
        }
      },
    });
  }, []);

  // Ensure the control is not associated to the wrong map
  useEffect(() => {
    if (!control) {
      return () => {};
    }

    control.map = map;

    return () => {
      control.map = null;
    };
  }, [map, control]);

  if (!control || !control.getCopyrights().length) {
    return null;
  }

  return (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: format(copyrights) || '',
      }}
    />
  );
}

Copyright.propTypes = propTypes;
Copyright.defaultProps = defaultProps;

export default React.memo(Copyright);
