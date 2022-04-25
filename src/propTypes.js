import PropTypes from 'prop-types';

const STATE_BOARDING = 'BOARDING';
const STATE_LEAVING = 'LEAVING';

const station = PropTypes.shape({
  arrivalDelay: PropTypes.number, // time in milliseconds.
  arrivalTime: PropTypes.number, // time in milliseconds.
  arrivalTimeWithDelay: PropTypes.number, // time in milliseconds with the delay included.
  cancelled: PropTypes.bool,
  coordinates: PropTypes.arrayOf(PropTypes.number),
  departureDelay: PropTypes.number, // time in milliseconds.
  departureTime: PropTypes.number, // time in milliseconds.
  departureTimeWithDelay: PropTypes.number, // time in milliseconds with the delay included
  noDropOff: PropTypes.bool,
  noPickUp: PropTypes.bool,
  stationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stationName: PropTypes.string,
  wheelchairAccessible: PropTypes.bool,
  state: PropTypes.oneOf([null, STATE_BOARDING, STATE_LEAVING]),
});

const lineInfos = PropTypes.shape({
  backgroundColor: PropTypes.string,
  bicyclesAllowed: PropTypes.bool,
  color: PropTypes.string,
  destination: PropTypes.string,
  feedsId: PropTypes.number,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  license: PropTypes.string,
  licenseNote: PropTypes.string,
  licenseUrl: PropTypes.string,
  longName: PropTypes.string,
  operatingInformations: PropTypes.object,
  operator: PropTypes.string,
  operatorTimeZone: PropTypes.string,
  operatorUrl: PropTypes.string,
  publisher: PropTypes.string,
  publisherTimeZone: PropTypes.string,
  publisherUrl: PropTypes.string,
  realTime: PropTypes.number,
  shortName: PropTypes.string,
  stations: PropTypes.arrayOf(station),
  vehicleType: PropTypes.number,
  wheelchairAccessible: PropTypes.bool,
});

export default {
  lineInfos,
  station,
  STATE_BOARDING,
  STATE_LEAVING,
};
