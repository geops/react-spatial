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
  const [currentZoom, setZoom] = useState();

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
    const view = map.getView();
    /* Some apps (e.g. Trafimage-Maps) do not load the correct zoom in time
     * to update the "disabledControls" object, so we trigger a seperate hook (see below)
     * using setZoom & currentZoom, which ensures it is written on mount and update.
     */
    setZoom(view.getZoom());
    view.on('propertychange', () => {
      /* Add view listener to trigger zoom update on view change. */
      setZoom(view.getZoom());
    });
  }, []);

  useEffect(() => {
    const view = map.getView();
    // We use the constrained max and min zoom, which is calculated including the viewport size
    setDisabledControls({
      zoomIn: view.getZoom() >= view.getConstrainedZoom(view.getMaxZoom()),
      zoomOut: view.getZoom() <= view.getConstrainedZoom(view.getMinZoom()),
    });
  }, [currentZoom]);

  useEffect(() => {
    /* Re-add the view listener in case the view was reloaded (e.g. when switching
     * between certain topics in Trafimage-Maps)
     */
    map.on('change:view', () => {
      map.getView().on('propertychange', () => {
        setZoom(map.getView().getZoom());
      });
    });

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
