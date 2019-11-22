import React, { useEffect, useRef, useCallback } from 'react';
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
};

const updateZoom = (map, zoomAction) => {
  map.getView().cancelAnimations();
  const zoom = map.getView().getZoom();

  map.getView().animate({
    zoom: zoom + zoomAction,
  });
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
  ...other
}) {
  const ref = useRef();
  const zoomIn = useCallback(
    evt => {
      if (!evt.which || evt.which === 13) {
        updateZoom(map, 1);
      }
    },
    [map],
  );

  const zoomOut = useCallback(
    evt => {
      if (!evt.which || evt.which === 13) {
        updateZoom(map, -1);
      }
    },
    [map],
  );

  useEffect(() => {
    let control;
    if (zoomSlider && ref.current) {
      control = new ZoomSlider();
      control.element.classList.remove('ol-control');
      // Unset tabIndex on zoom slider button.
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
      <div
        role="button"
        tabIndex={0}
        className="rs-zoom-in rs-round-blue"
        title={titles.zoomIn}
        onClick={zoomIn}
        onKeyPress={zoomIn}
      >
        {zoomInChildren}
      </div>
      {zoomSlider ? <div className="rs-zoomslider-wrapper" ref={ref} /> : null}
      <div
        role="button"
        tabIndex={0}
        className="rs-zoom-out rs-round-blue"
        title={titles.zoomOut}
        onClick={zoomOut}
        onKeyPress={zoomOut}
      >
        {zoomOutChildren}
      </div>
    </div>
  );
}

Zoom.propTypes = propTypes;
Zoom.defaultProps = defaultProps;

export default React.memo(Zoom);
