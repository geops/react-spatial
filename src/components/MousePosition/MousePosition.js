import OLMousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import OLMap from "ol/Map";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";

const propTypes = {
  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Function triggered on projection's change event.
   * @param {Event} event The change event object.
   * @param {Object} projection The selected projection object.
   */
  onChange: PropTypes.func,

  /**
   * List of projections to display.
   */
  projections: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * A function following the  [CoordinateFormat](https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~CoordinateFormat).
       */
      format: PropTypes.func,

      /**
       * The label to display in the select box.
       */
      label: PropTypes.string.isRequired,

      /**
       * The value used to create the options´s projection of the MousePosition control.
       * See [doc](https://openlayers.org/en/latest/apidoc/module-ol_control_MousePosition.html).
       */
      value: PropTypes.string.isRequired,
    }),
  ),

  /**
   * The initially selected projection
   */
  projectionValue: PropTypes.shape({
    /**
     * A function following the  [CoordinateFormat](https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~CoordinateFormat).
     */
    format: PropTypes.func,

    /**
     * The label to display in the select box.
     */
    label: PropTypes.string.isRequired,

    /**
     * The value used to create the options´s projection of the MousePosition control.
     * See [doc](https://openlayers.org/en/latest/apidoc/module-ol_control_MousePosition.html).
     */
    value: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  onChange: () => {},
  projections: [
    {
      label: "EPSG:4326",
      value: "EPSG:4326",
    },
    {
      label: "EPSG:3857",
      value: "EPSG:3857",
    },
  ],
  projectionValue: null,
};

/**
 * The MousePosition component renders a select box with map projection options
 * and the cursor position in coordinates using the selected projection.
 */
function MousePosition({
  map,
  onChange = defaultProps.onChange,
  projections = defaultProps.projections,
  projectionValue = defaultProps.projectionValue,
  ...other
}) {
  const [projection, setProjection] = useState(
    projections &&
      ((projectionValue &&
        projections.find((p) => {
          return p.value === projectionValue.value;
        })) ||
        projections[0]),
  );
  const [control, setControl] = useState();
  const ref = useRef();

  useEffect(() => {
    const mousePosition = new OLMousePosition({
      className: "",
      placeholder: "&nbsp;",
      target: ref.current,
    });
    map.addControl(mousePosition);
    setControl(mousePosition);

    return () => {
      map.removeControl(mousePosition);
    };
  }, [map]);

  useEffect(() => {
    if (!projection || !control) {
      return;
    }
    control.setProjection(projection.value);
    control.setCoordinateFormat(projection.format || createStringXY(4));
  }, [projection, control]);

  useEffect(() => {
    if (projections) {
      const proj =
        (projectionValue &&
          projections.find((p) => {
            return p.value === projectionValue.value;
          })) ||
        projections[0];
      setProjection(proj);
    }
  }, [projections, projectionValue]);

  const onChangeCb = useCallback(
    (evt) => {
      const newProj = projections.find((opt) => {
        return evt.target.value === opt.value;
      });
      setProjection(newProj);
      onChange(evt, newProj);
    },
    [onChange, projections],
  );

  if (!projection || !projections || !projections.length) {
    return null;
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="rs-mouse-position" {...other}>
      <select
        className="rs-select"
        onChange={onChangeCb}
        value={projection.value}
      >
        {projections.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      <span className="rs-coordinates" ref={ref} />
    </div>
  );
}

MousePosition.propTypes = propTypes;

export default React.memo(MousePosition);
