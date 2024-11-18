/* eslint-disable react/no-unused-prop-types */
import {
  realtimeConfig,
  RealtimeLayer as TrackerLayer,
} from "mobility-toolbox-js/ol";
import PropTypes from "prop-types";
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

import firstStation from "../../images/RouteSchedule/firstStation.png";
import lastStation from "../../images/RouteSchedule/lastStation.png";
import line from "../../images/RouteSchedule/line.png";
import station from "../../images/RouteSchedule/station.png";
import ReactTransitPropTypes from "../../propTypes";
import {
  getDelayString as defaultGetDelayString,
  getHoursAndMinutes,
} from "../../utils/timeUtils";

const { getBgColor } = realtimeConfig;

/**
 * Returns a color class to display the delay.
 * @param {Number} time Delay time in milliseconds.
 */
const defaultGetDelayColor = (time) => {
  const secs = Math.round(((time / 1800 / 2) * 3600) / 1000);
  if (secs >= 3600) {
    return "rgb(237 0 76)";
  }
  if (secs >= 500) {
    return "rgb(232 0 0)";
  }
  if (secs >= 300) {
    return "rgb(255 74 0)";
  }
  if (secs >= 180) {
    return "rgb(247 191 0)";
  }
  return "rgb(0 160 12)";
};

/**
 * Returns true if the train doesn't stop to the station.
 * @param {Object} stop Station information.
 */
const isNotStop = (stop) => {
  return !stop.arrivalTime && !stop.departureTime;
};

/**
 * Returns if the station has already been passed by the vehicule.
 * @param {Object} stop Station information.
 * @param {number} time The current time to test in ms.
 * @param {Array<Object>} stops the list of all stops of the train.
 * @param {idx} idx The index of the stop object in the stops array.
 */
const isPassed = (stop, time, stops, idx) => {
  // If the train doesn't stop to the stop object, we test if the stop just before has been passed or not.
  // if yes the current stop is considered as passed.
  if (isNotStop(stop)) {
    if (stops[idx - 1] && idx > 0) {
      return isPassed(stops[idx - 1], time, stops, idx);
    }
    return true;
  }

  // Sometimes stop.departureDelay is undefined.
  const timeToCompare = stop.aimedDepartureTime || stop.aimedArrivalTime || 0;
  let delayToCompare = stop.departureDelay || stop.arrivalDelay || 0;

  // It could happens that the delay is negative we simply ignores it.
  if (delayToCompare < 0) {
    delayToCompare = 0;
  }

  return timeToCompare + delayToCompare <= time;
};

/**
 * Returns an image for first, middle or last stations.
 * @param {Number} stations The stations list.
 * @param {Number} index Index of the station in the list.
 * @param {Boolean} isStationPassed If the train is already passed at this station.
 * @param {Boolean} isNotStation If the train doesn't stop to this station.
 */
const defaultRenderStationImg = (
  stations,
  index,
  isStationPassed,
  isNotStation,
) => {
  const { length } = stations;
  let src = station.src || station;
  if (index === 0) {
    src = firstStation.src || firstStation;
  } else if (index === length - 1) {
    src = lastStation.src || lastStation;
  } else if (isNotStation) {
    src = line.src || line;
  }
  return <img alt="routeScheduleLine" className="rt-route-icon" src={src} />;
};

/**
 * Returns an text.
 * @param {Number} stations The stations list.
 * @param {Number} index Index of the station in the list.
 * @param {Boolean} cancelled If the station is cancelled
 */
const defaultRenderStationName = (stations, index, cancelled) => {
  const { stationName } = stations[index];
  return (
    <div className={cancelled ? "rt-route-cancelled" : ""}>{stationName}</div>
  );
};

/**
 * Render a delay string.
 * @param {Number} delay  The delay in ms to display.
 * @param {Boolean} stop The current stop object.
 * @param {Function} getDelayString Function to get string to display.
 * @param {Function} getColor Define the css color to use.
 *
 */
const defaultRenderDelay = (delay, stop, getDelayString, getDelayColor) => {
  return (
    <span style={{ color: getDelayColor?.(delay, stop) || "inherit" }}>
      {`${getDelayString?.(delay, stop) || ""}`}
    </span>
  );
};

const emptyFunc = () => {};

function RouteStop({
  getDelayColor = defaultGetDelayColor,
  getDelayString = defaultGetDelayString,
  idx,
  lineInfos,
  onStationClick = emptyFunc,
  renderArrivalDelay = defaultRenderDelay,
  renderDepartureDelay = defaultRenderDelay,
  renderStationImg = defaultRenderStationImg,
  renderStationName = defaultRenderStationName,
  stop,
  trackerLayer,
}) {
  const {
    aimedArrivalTime,
    aimedDepartureTime,
    arrivalDelay,
    departureDelay,
    state,
  } = stop;
  const cancelled = state === "JOURNEY_CANCELLED" || state === "STOP_CANCELLED";
  const { stations } = lineInfos;
  const isFirstStation = idx === 0;
  const isLastStation = idx === stations.length - 1;
  const isNotStation = isNotStop(stop);
  const [isStationPassed, setIsStationPassed] = useState(false);

  useEffect(() => {
    let timeout = null;

    const isStopPassed = isPassed(stop, trackerLayer.time, stations, idx);
    setIsStationPassed(isStopPassed);

    // We have to refresh the stop when the state it's time_based
    if (stop.state === "TIME_BASED" && !isStopPassed) {
      timeout = setInterval(() => {
        setIsStationPassed(isPassed(stop, trackerLayer.time, stations, idx));
      }, 20000);
    }
    return () => {
      clearInterval(timeout);
    };
  }, [stop, trackerLayer, stations, idx]);

  return (
    <div
      className={[
        "rt-route-station",
        isStationPassed ? " rt-passed" : "",
        isNotStation ? " rt-no-stop" : "",
      ].join("")}
      onClick={(e) => {
        return onStationClick(stop, e);
      }}
      onKeyPress={(e) => {
        return e.which === 13 && onStationClick(stop, e);
      }}
      role="button"
      tabIndex={0}
    >
      <div className="rt-route-delay">
        {arrivalDelay === undefined ||
        arrivalDelay === null ||
        isFirstStation ||
        cancelled
          ? ""
          : renderArrivalDelay(
              arrivalDelay,
              stop,
              getDelayString,
              getDelayColor,
            )}
        {departureDelay === undefined ||
        departureDelay === null ||
        isLastStation ||
        cancelled
          ? ""
          : renderDepartureDelay(
              departureDelay,
              stop,
              getDelayString,
              getDelayColor,
            )}
      </div>
      <div className="rt-route-times">
        <span
          className={`rt-route-time-arrival ${
            cancelled ? "rt-route-cancelled" : ""
          }`}
        >
          {getHoursAndMinutes(aimedArrivalTime)}
        </span>
        <span
          className={`rt-route-time-departure ${
            cancelled ? "rt-route-cancelled" : ""
          }`}
        >
          {getHoursAndMinutes(aimedDepartureTime)}
        </span>
      </div>
      {renderStationImg(stations, idx, isStationPassed, isNotStation)}
      {renderStationName(stations, idx, cancelled)}
    </div>
  );
}

const defaultRenderStation = (props) => {
  const { arrivalTime, departureTime, stationId, stationName } = props.stop;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <RouteStop
      // Train line can go in circle so begin and end have the same id,
      // using the time in the key should fix the issue.
      key={(stationId || stationName) + arrivalTime + departureTime}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

const defaultRenderRouteIdentifier = ({ longName, routeIdentifier }) => {
  if (routeIdentifier) {
    // first part of the id, without leading zeros.
    const id = parseInt(routeIdentifier.split(".")[0], 10);
    if (!longName.includes(id) && !Number.isNaN(id)) {
      return ` (${id})`;
    }
  }
  return null;
};
const defaultRenderHeaderButtons = () => {
  return null;
};

const defaultRenderHeader = ({
  lineInfos,
  renderHeaderButtons = defaultRenderHeaderButtons,
  renderRouteIdentifier = defaultRenderRouteIdentifier,
}) => {
  const {
    destination,
    longName,
    routeIdentifier,
    shortName,
    stroke,
    text_color: textColor,
    type,
    vehicleType,
  } = lineInfos;
  return (
    <div className="rt-route-header">
      <span
        className="rt-route-icon"
        style={{
          /* stylelint-disable-next-line value-keyword-case */
          backgroundColor: stroke || getBgColor(type || vehicleType),
          color: textColor || "black",
        }}
      >
        {shortName}
      </span>
      <div className="rt-route-title">
        <span className="rt-route-name">{destination}</span>
        <span>
          {longName}
          {renderRouteIdentifier(lineInfos)}
        </span>
      </div>
      <div className="rt-route-buttons">
        {renderHeaderButtons(routeIdentifier)}
      </div>
    </div>
  );
};

const defaultRenderLink = (text, url) => {
  return (
    <div className="rt-route-copyright-link">
      {url ? (
        <a href={url} rel="noreferrer" target="_blank">
          {text}
        </a>
      ) : (
        text
      )}
    </div>
  );
};

const defaultRenderCopyright = ({ lineInfos }) => {
  return (
    <span className="rt-route-copyright">
      {lineInfos.operator &&
        defaultRenderLink(lineInfos.operator, lineInfos.operatorUrl)}
      {lineInfos.operator && lineInfos.publisher && <span>&nbsp;-&nbsp;</span>}
      {lineInfos.publisher &&
        defaultRenderLink(lineInfos.publisher, lineInfos.publisherUrl)}
      {lineInfos.license && <span>&nbsp;(</span>}
      {lineInfos.license &&
        defaultRenderLink(lineInfos.license, lineInfos.licenseUrl)}
      {lineInfos.license && ")"}
    </span>
  );
};

const defaultRenderFooter = (props) => {
  const { lineInfos, renderCopyright = defaultRenderCopyright } = props;
  if (!lineInfos.operator && !lineInfos.publisher) {
    return null;
  }
  return <div className="rt-route-footer">{renderCopyright({ ...props })}</div>;
};

const propTypes = {
  /**
   * CSS class of the route schedule wrapper.
   */
  className: PropTypes.string,

  /**
   * Function to get the delay color.
   */
  getDelayColor: PropTypes.func,

  /**
   * Function to get the delay string for stations.
   */
  getDelayString: PropTypes.func,

  /**
   * Trajectory stations informations.
   */
  lineInfos: ReactTransitPropTypes.lineInfos,

  /**
   * Function triggered on station's click event.
   */
  onStationClick: PropTypes.func,

  /**
   * Render delay for arrival.
   */
  renderArrivalDelay: PropTypes.func,

  /**
   * Render Copyright of the route scheduler.
   */
  renderCopyright: PropTypes.func,

  /**
   * Render delay for departure.
   */
  renderDepartureDelay: PropTypes.func,

  /**
   * Render Footer of the route scheduler.
   */
  renderFooter: PropTypes.func,

  /**
   * Render Header of the route scheduler.
   */
  renderHeader: PropTypes.func,

  /**
   * Function to render header buttons.
   */
  renderHeaderButtons: PropTypes.func,

  /**
   * Render the route identifier in the header
   */
  renderRouteIdentifier: PropTypes.func,

  /**
   * Render a station.
   */
  renderStation: PropTypes.func,

  /**
   * Render the status of the station image.
   */
  renderStationImg: PropTypes.func,

  /**
   * Render a station name.
   */
  renderStationName: PropTypes.func,

  /**
   * Trackerlayer.
   */
  trackerLayer: PropTypes.instanceOf(TrackerLayer).isRequired,
};

/**
 * RouteSchedule displays information, stops and punctuality about the clicked route.
 */
function RouteSchedule({
  className = "rt-route-schedule",
  renderFooter = defaultRenderFooter,
  renderHeader = defaultRenderHeader,
  renderStation = defaultRenderStation,
  ...props
}) {
  const { lineInfos } = props;

  if (!lineInfos) {
    return null;
  }

  return (
    <div className={className}>
      {renderHeader({ ...props })}
      <div className="rt-route-body">
        {lineInfos.stations.map((stop, idx) => {
          return renderStation({ ...props, idx, stop });
        })}
      </div>
      {renderFooter({ ...props })}
    </div>
  );
}

RouteSchedule.propTypes = propTypes;

export default React.memo(RouteSchedule);
