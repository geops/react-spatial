import React from 'react';
import PropTypes from 'prop-types';
import { FaExpand } from 'react-icons/fa';
import OLMap from 'ol/Map';
import Button from '../Button';

const propTypes = {
  /**
   * An ol map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * The extent to be zoomed.
   */
  extent: PropTypes.arrayOf(PropTypes.number).isRequired,

  /**
   * Title for the fitExtent button.
   */
  title: PropTypes.string,

  /**
   * CSS class of the fitExtent button.
   */
  className: PropTypes.string,

  /**
   * Children content of the fitExtent button.
   */
  children: PropTypes.node,
};

const defaultProps = {
  title: 'Fit Extent',
  className: 'tm-button tm-round-blue',
  children: <FaExpand focusable={false} />,
};

const fitExtentFc = (map, extent) => {
  map.getView().cancelAnimations();
  map.getView().fit(extent, map.getSize());
};

/**
 * This component creates a button to zoom to the given extent.
 */
function FitExtent({ map, extent, title, className, children }) {
  return (
    <Button
      className={className}
      title={title}
      onClick={() => fitExtentFc(map, extent)}
    >
      {children}
    </Button>
  );
}

FitExtent.propTypes = propTypes;
FitExtent.defaultProps = defaultProps;

export default FitExtent;
