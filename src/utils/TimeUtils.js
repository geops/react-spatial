// Get a Date object as date string .
// ex: 2019 09 01
export const getDateString = (now) => {
  const n = now || new Date();
  let month = (n.getMonth() + 1).toString();
  month = month.length === 1 ? `0${month}` : month;
  let day = n.getDate().toString();
  day = day.length === 1 ? `0${day}` : day;

  return [now.getFullYear(), month, day].join('');
};

// Get the UTC time string of Date object.
// ex: 09:05:01.123
export const getUTCTimeString = (date) => {
  return [
    date.getUTCHours(),
    date.getUTCMinutes(),
    `${date.getUTCSeconds()}.${date.getUTCMilliseconds()}`,
  ].join(':');
};

// Returns a string representation of a number, with a zero if the number is lower than 10.
export const pad = (integer) => {
  return integer < 10 ? `0${integer}` : integer;
};

/**
 * Returns a 'hh:mm' string from a time in ms.
 * @param {Number} timeInMs Time in milliseconds.
 * @private
 */
export const getHoursAndMinutes = (timeInMs) => {
  if (!timeInMs || timeInMs <= 0) {
    return '';
  }
  const date = new Date(timeInMs);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Returns a string representing a delay.
 * @param {Number} timeInMs Delay time in milliseconds.
 * @private
 */
export const getDelayString = (timeInMs) => {
  const h = Math.floor(timeInMs / 3600000);
  const m = Math.floor((timeInMs % 3600000) / 60000);
  const s = Math.floor(((timeInMs % 3600000) % 60000) / 1000);

  if (s === 0 && h === 0 && m === 0) {
    return '0';
  }
  if (s === 0 && h === 0) {
    return `${m}m`;
  }
  if (s === 0) {
    return `${h}h${m}m`;
  }
  if (m === 0 && h === 0) {
    return `${s}s`;
  }
  if (h === 0) {
    return `${m}m${s}s`;
  }
  return `${h}h${m}m${s}s`;
};
