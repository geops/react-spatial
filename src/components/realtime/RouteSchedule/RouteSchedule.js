/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTransitPropTypes from '../../../propTypes';
import firstStation from '../../../images/RouteSchedule/firstStation.png';
import station from '../../../images/RouteSchedule/station.png';
import lastStation from '../../../images/RouteSchedule/lastStation.png';
import { bgColors } from '../../../config/tracker';
import { getHoursAndMinutes, getDelayString } from '../../../utils/TimeUtils';

import TrackerLayer from '../../../layers/TrackerLayer';

/**
 * Returns a color class to display the delay.
 * @param {Number} time Delay time in milliseconds.
 */
const getDelayColor = (time) => {
  const secs = Math.round(((time / 1800 / 2) * 3600) / 1000);
  if (secs >= 3600) {
    return 'dark-red';
  }
  if (secs >= 500) {
    return 'middle-red';
  }
  if (secs >= 300) {
    return 'light-red';
  }
  if (secs >= 180) {
    return 'orange';
  }
  return 'green';
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
 */
const isPassed = (stop, time) => {
  // Sometimes stop.departureDelay is undefined.
  const timeToCompare = stop.departureTime || stop.arrivalTime || 0;
  const delayToCompare = stop.departureDelay || stop.arrivalDelay || 0;
  return !isNotStop(stop) && timeToCompare + delayToCompare <= time;
};

const getStationImg = (index, length) => {
  let src = station;
  if (index === 0) {
    src = firstStation;
  } else if (index === length - 1) {
    src = lastStation;
  }
  return src;
};

/**
 * Returns an image for first, middle or last stations.
 * @param {Number} index Index of the station in the list.
 * @param {Number} length Length of the stations list.
 */
const defaultRenderStationImg = (stations, index, length) => {
  const src = getStationImg(index, length);
  return <img src={src} alt="routeScheduleLine" className="rt-route-icon" />;
};

const defaultRenderStation = ({
  lineInfos,
  onStationClick,
  trackerLayer,
  renderStationImg,
  stop,
  idx,
}) => {
  const {
    stationId,
    arrivalDelay,
    departureDelay,
    arrivalTime,
    departureTime,
    cancelled,
    stationName,
  } = stop;
  const { stations } = lineInfos;
  const isFirstStation = idx === 0;
  const isLastStation = idx === stations.length - 1;
  const isStationPassed = isPassed(stop, trackerLayer.currTime);
  const isNotStation = isNotStop(stop);
  return (
    <div
      key={stationId}
      role="button"
      className={[
        'rt-route-station',
        isStationPassed ? ' rt-passed' : '',
        isNotStation ? ' rt-no-stop' : '',
      ].join('')}
      onClick={(e) => onStationClick(stop, e)}
      tabIndex={0}
      onKeyPress={(e) => e.which === 13 && onStationClick(stop, e)}
    >
      <div className="rt-route-delay">
        {typeof arrivalDelay === 'undefined' || isFirstStation ? null : (
          <span
            className={`rt-route-delay-arrival${` ${getDelayColor(
              arrivalDelay,
            )}`}`}
          >
            {`+${getDelayString(arrivalDelay)}`}
          </span>
        )}
        {typeof departureDelay === 'undefined' || isLastStation ? null : (
          <span
            className={`rt-route-delay-departure${` ${getDelayColor(
              departureDelay,
            )}`}`}
          >
            {`+${getDelayString(departureDelay)}`}
          </span>
        )}
      </div>
      <div className="rt-route-times">
        <span className="rt-route-time-arrival">
          {getHoursAndMinutes(arrivalTime)}
        </span>
        <span className="rt-route-time-departure">
          {getHoursAndMinutes(departureTime)}
        </span>
      </div>
      {renderStationImg(stations, idx, stations.length, isNotStation)}
      <div className={isLastStation && cancelled ? 'rt-route-cancelled' : null}>
        {stationName}
      </div>
    </div>
  );
};

const renderRouteIdentifier = ({ routeIdentifier, longName }) => {
  // first part of the id, without leading zeros.
  const id = parseInt(routeIdentifier.split('.')[0], 10);
  if (!longName.includes(id)) {
    return ` (${id})`;
  }
  return null;
};

const defaultRenderheader = ({ lineInfos, renderHeaderButtons }) => {
  const {
    vehicleType,
    shortName,
    longName,
    color,
    backgroundColor,
    destination,
    routeIdentifier,
  } = lineInfos;
  return (
    <div className="rt-route-header">
      <span
        className="rt-route-icon"
        style={{
          backgroundColor: backgroundColor || bgColors[vehicleType],
          color: color || 'black',
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

const propTypes = {
  /**
   * CSS class of the route schedule wrapper.
   */
  className: PropTypes.string,

  /**
   * Trajectory stations informations.
   */
  lineInfos: ReactTransitPropTypes.lineInfos,

  /**
   * Trackerlayer.
   */
  trackerLayer: PropTypes.instanceOf(TrackerLayer).isRequired,

  /**
   * Render Header of the route scheduler.
   */
  renderHeader: PropTypes.func,

  /**
   * Render the status of the station image.
   */
  renderStationImg: PropTypes.func,

  /**
   * Render a station.
   */
  renderStation: PropTypes.func,

  /**
   * Function triggered on station's click event.
   */
  onStationClick: PropTypes.func,

  /**
   * Function to render header buttons.
   */
  renderHeaderButtons: PropTypes.func,
};

const defaultProps = {
  className: 'rt-route-schedule',
  lineInfos: null,
  renderHeader: defaultRenderheader,
  renderStation: defaultRenderStation,
  renderStationImg: defaultRenderStationImg,
  renderHeaderButtons: () => null,
  onStationClick: () => {},
};

/**
 * RouteSchedule displays information, stops and punctuality about the clicked route.
 */
function RouteSchedule(props) {
  const { lineInfos, className, renderStation, renderHeader } = props;

  if (!lineInfos) {
    return null;
  }

  return (
    <div className={className}>
      {renderHeader({ ...props })}
      <div className="rt-route-body">
        {lineInfos.stations.map((stop, idx) =>
          renderStation({ ...props, stop, idx }),
        )}
      </div>
    </div>
  );
}

RouteSchedule.propTypes = propTypes;
RouteSchedule.defaultProps = defaultProps;

export default React.memo(RouteSchedule);
