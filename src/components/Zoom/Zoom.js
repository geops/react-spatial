import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { FaPlus, FaMinus } from "react-icons/fa";
import { ZoomSlider } from "ol/control";
import OLMap from "ol/Map";
import { easeOut } from "ol/easing";
import { unByKey } from "ol/Observable";

const propTypes = {
  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
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

const defaultProps = {
  titles: {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
  },
  zoomInChildren: <FaPlus focusable={false} />,
  zoomOutChildren: <FaMinus focusable={false} />,
  zoomSlider: false,
  delta: 1,
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
    zoom: constrainedZoom,
    duration: 250,
    easing: easeOut,
  });
};

/**
 * The Zoom component creates a zoom wrapper containing zoom-in and zoom-out buttons
 * and an optional [ol/ZoomSlider](https://openlayers.org/en/latest/apidoc/module-ol_control_ZoomSlider-ZoomSlider.html).
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
  const [currentZoom, setZoom] = useState();

  const zoomIn = useCallback(
    (evt) => {
      if (!evt.which || evt.which === 13) {
        updateZoom(map, delta);
      }
    },
    [delta, map],
  );

  const zoomOut = useCallback(
    (evt) => {
      if (!evt.which || evt.which === 13) {
        updateZoom(map, -delta);
      }
    },
    [delta, map],
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
        type="button"
        tabIndex={0}
        className="rs-zoom-in"
        title={titles.zoomIn}
        onClick={zoomIn}
        onKeyPress={zoomIn}
        disabled={zoomInDisabled}
      >
        {zoomInChildren}
      </button>
      {zoomSlider ? <div className="rs-zoomslider-wrapper" ref={ref} /> : null}
      <button
        type="button"
        tabIndex={0}
        className="rs-zoom-out"
        title={titles.zoomOut}
        onClick={zoomOut}
        onKeyPress={zoomOut}
        disabled={zoomOutDisabled}
      >
        {zoomOutChildren}
      </button>
    </div>
  );
}

Zoom.propTypes = propTypes;
Zoom.defaultProps = defaultProps;

export default React.memo(Zoom);
