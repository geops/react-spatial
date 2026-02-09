import { ZoomSlider } from "ol/control";
import { easeOut } from "ol/easing";
import OLMap from "ol/Map";
import { unByKey } from "ol/Observable";
import PropTypes from "prop-types";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const propTypes = {
  /**
   * The zoom delta applied on each click.
   */
  delta: PropTypes.number,

  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Callback function on zoom-in button click.
   * @param {function} Callback function triggered when zoom-in button is clicked. Takes the event as argument.
   */
  onZoomInButtonClick: PropTypes.func,

  /**
   * Callback function on zoom-out button click.
   * @param {function} Callback function triggered when the zoom-out button is clicked. Takes the event as argument.
   */
  onZoomOutButtonClick: PropTypes.func,

  /**
   * Titles HTML attribtues for button.
   */
  titles: PropTypes.shape({
    zoomIn: PropTypes.string,
    zoomOut: PropTypes.string,
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

const updateZoom = (map, delta) => {
  const view = map.getView();
  const currentZoom = view.getZoom();
  const newZoom = currentZoom + delta;
  const constrainedZoom = view.getConstrainedZoom(newZoom);
  if (view.getAnimating()) {
    view.cancelAnimations();
  }
  view.animate({
    duration: 250,
    easing: easeOut,
    zoom: constrainedZoom,
  });
};

/**
 * The Zoom component creates a zoom wrapper containing zoom-in and zoom-out buttons
 * and an optional [ol/ZoomSlider](https://openlayers.org/en/latest/apidoc/module-ol_control_ZoomSlider-ZoomSlider.html).
 */
function Zoom({
  delta = 1,
  map,
  onZoomInButtonClick = null,
  onZoomOutButtonClick = null,
  titles = {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
  },
  zoomInChildren = <FaPlus focusable={false} />,
  zoomOutChildren = <FaMinus focusable={false} />,
  zoomSlider = false,
  ...other
}) {
  const ref = useRef();
  const [currentZoom, setZoom] = useState();

  const zoomIn = useCallback(
    (evt) => {
      if (onZoomInButtonClick) {
        onZoomInButtonClick(evt);
      }
      if (!evt.which || evt.which === 13) {
        updateZoom(map, delta);
      }
    },
    [delta, map, onZoomInButtonClick],
  );

  const zoomOut = useCallback(
    (evt) => {
      if (onZoomOutButtonClick) {
        onZoomOutButtonClick(evt);
      }
      if (!evt.which || evt.which === 13) {
        updateZoom(map, -delta);
      }
    },
    [delta, map, onZoomOutButtonClick],
  );

  const zoomInDisabled = useMemo(() => {
    return (
      currentZoom >=
      map.getView().getConstrainedZoom(map.getView().getMaxZoom())
    );
  }, [currentZoom, map]);

  const zoomOutDisabled = useMemo(() => {
    return (
      currentZoom <=
      map.getView().getConstrainedZoom(map.getView().getMinZoom())
    );
  }, [currentZoom, map]);

  useEffect(() => {
    // Trigger zoom update to disable zooms on max and min
    const listenerKey = map.on("moveend", () => {
      setZoom(map.getView().getZoom());
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
      unByKey(listenerKey);
      if (control) {
        map.removeControl(control);
      }
    };
  }, [map, zoomSlider]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="rs-zooms-bar" {...other}>
      <button
        className="rs-zoom-in"
        disabled={zoomInDisabled}
        onClick={zoomIn}
        onKeyPress={zoomIn}
        tabIndex={0}
        title={titles.zoomIn}
        type="button"
      >
        {zoomInChildren}
      </button>
      {zoomSlider ? <div className="rs-zoomslider-wrapper" ref={ref} /> : null}
      <button
        className="rs-zoom-out"
        disabled={zoomOutDisabled}
        onClick={zoomOut}
        onKeyPress={zoomOut}
        tabIndex={0}
        title={titles.zoomOut}
        type="button"
      >
        {zoomOutChildren}
      </button>
    </div>
  );
}

Zoom.propTypes = propTypes;

export default React.memo(Zoom);
