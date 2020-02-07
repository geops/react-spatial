import OLTile from 'ol/layer/Tile';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import Base from './Base';

function Tile({ children, source }) {
  const layer = useMemo(() => new OLTile({ source }), [source]);
  return <Base layer={layer}>{children}</Base>;
}

Tile.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  source: PropTypes.shape().isRequired,
};

Tile.defaultProps = {
  children: null,
};

export default Tile;
