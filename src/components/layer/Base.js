import OLBase from 'ol/layer/Base';
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';

import { MapContext } from '../BasicMap/BasicMap';

export const LayerContext = React.createContext();

function Base({ children, layer }) {
  const map = useContext(MapContext);
  useEffect(() => map.addLayer(layer), [map, layer]);
  return (
    <LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
  );
}

Base.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  layer: PropTypes.oneOfType([PropTypes.instanceOf(OLBase)]).isRequired,
};

Base.defaultProps = {
  children: null,
};

export default Base;
