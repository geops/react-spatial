import React, { useEffect, useRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { ZoomSlider } from 'ol/control';
import OLMap from 'ol/Map';

const propTypes = {
  /**
   * An ol map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * The zoom delta applied on each click.
   */
  delta: PropTypes.number,

  /**
   * Titles HTML attribtues for button.
   */
  titles: PropTypes.shape({
    zoomIn: PropTypes.string,
    zoomOut: PropTypes.stirng,
  }),

  /**
   * Children content of the zoom in button.
   */
  zoomInChildren: PropTypes.node,

  /**
   * Children content of the zoom out button.
   */
  zoomOutChildren: PropTypes.node,

  /**
   * Display a slider to zoom.
   */
  zoomSlider: PropTypes.bool,
};

const defaultProps = {
  titles: {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
  },
  zoomInChildren: <FaPlus focusable={false} />,
  zoomOutChildren: <FaMinus focusable={false} />,
  zoomSlider: false,
  delta: 1,
};

const getZoomLimits = (map) => {
  return {
    minZoom: map.getView().getMinZoom() || 1.5, // Prevent minimum from being 0
    maxZoom: map.getView().getMaxZoom() || 22, // Default maxZoom from BasicMap
  };
};

const updateZoom = (map, zoomAction) => {
  map.getView().cancelAnimations();
  const zoom = map.getView().getZoom();

  map.getView().animate({ zoom: zoom + zoomAction });
};

/**
 * This component creates a zoom wrapper.
 */
function Zoom({
  map,
  titles,
  zoomInChildren,
  zoomOutChildren,
  zoomSlider,
  delta,
  ...other
}) {
  const ref = useRef();
  const [disabledControls, setDisabledControls] = useState({
    zoomIn: false,
    zoomOut: false,
  });

  const zoomIn = useCallback(
    (evt) => {
      if (!evt.which || evt.which === 13) {
        updateZoom(map, delta);
      }
    },
    [map],
  );

  const zoomOut = useCallback(
    (evt) => {
      if (!evt.which || evt.which === 13) {
        updateZoom(map, -delta);
      }
    },
    [map],
  );

  useEffect(() => {
    // Set disabled zoom controls on mount
    setDisabledControls({
      zoomIn: map.getView().getZoom() >= getZoomLimits(map).maxZoom,
      zoomOut: map.getView().getZoom() <= getZoomLimits(map).minZoom,
    });
    map.getView().on('change', () => {
      // Add listener to set disabled zoom controls on view change
      const zoom = map.getView().getZoom();
      setDisabledControls({
        zoomIn: zoom >= getZoomLimits(map).maxZoom,
        zoomOut: zoom <= getZoomLimits(map).minZoom,
      });
    });
  }, []);

  useEffect(() => {
    let control;
    if (zoomSlider && ref.current) {
      control = new ZoomSlider();
      // We don't want to navigate to the zoom slider using TAB navigation.
      control.element.firstElementChild.tabIndex = -1;
      // Set the zoom slider in the custom control wrapper.
      control.setTarget(ref.current);
      map.addControl(control);
    }
    return () => {
      if (control) {
        map.removeControl(control);
      }
    };
  }, [map, zoomSlider, ref.current]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="rs-zooms-bar" {...other}>
      <button
        type="button"
        tabIndex={0}
        className={`rs-zoom-in${
          disabledControls.zoomIn ? ' rs-zoom-disabled' : ''
        }`}
        title={titles.zoomIn}
        onClick={zoomIn}
        onKeyPress={zoomIn}
        disabled={disabledControls.zoomIn}
      >
        {zoomInChildren}
      </button>
      {zoomSlider ? <div className="rs-zoomslider-wrapper" ref={ref} /> : null}
      <button
        type="button"
        tabIndex={0}
        className={`rs-zoom-out${
          disabledControls.zoomOut ? ' rs-zoom-disabled' : ''
        }`}
        title={titles.zoomOut}
        onClick={zoomOut}
        onKeyPress={zoomOut}
        disabled={disabledControls.zoomOut}
      >
        {zoomOutChildren}
      </button>
    </div>
  );
}

Zoom.propTypes = propTypes;
Zoom.defaultProps = defaultProps;

export default React.memo(Zoom);
