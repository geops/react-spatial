import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IoIosSpeedometer } from 'react-icons/io';
import { FaPlay, FaForward, FaBackward, FaRegDotCircle } from 'react-icons/fa';
import { TrackerLayer } from 'mobility-toolbox-js/src/ol/';

const increaseSpeed = (speed) => {
  let delta = 0.1;
  if (speed >= 1) {
    delta = 1;
  }
  if (speed >= 10) {
    delta = 5;
  }
  const nextSpeed = speed + delta;
  return nextSpeed > 30 ? speed : nextSpeed;
};

const decreaseSpeed = (speed) => {
  let delta = 0.1;
  if (speed > 1) {
    delta = 1;
  }
  if (speed > 10) {
    delta = 5;
  }
  const nextSpeed = speed - delta;
  if (nextSpeed < 0.1) {
    return speed;
  }
  return nextSpeed;
};

const defaultRenderButton = (icon, onClick, title) => {
  return (
    <div
      aria-label={title}
      role="button"
      onClick={onClick}
      onKeyPress={onClick}
      className="rt-control-button"
      tabIndex={0}
      title={title}
    >
      {icon}
    </div>
  );
};

/**
 * TrackerControl allows the user to control the speed of a trackerLayer.
 */
function TrackerControl({
  className,
  iconDateReset,
  iconSpeedDown,
  iconSpeedReset,
  iconSpeedUp,
  iconSpeed,
  renderButton,
  trackerLayer,
}) {
  const [speed, setSpeed] = useState(1);

  const onSpeedChange = (newSpeed) => {
    // eslint-disable-next-line no-param-reassign
    trackerLayer.speed = newSpeed;
  };

  const resetDate = () => {
    trackerLayer.setCurrTime(new Date());
  };

  useEffect(() => {
    onSpeedChange(speed);
  }, [speed, onSpeedChange]);

  return (
    <div className={className}>
      {renderButton(iconDateReset, () => resetDate(), 'reset date')}
      {renderButton(
        iconSpeedDown,
        () => setSpeed(decreaseSpeed(speed)),
        'speed down',
      )}
      {renderButton(iconSpeedReset, () => setSpeed(1), 'speed reset')}
      {renderButton(
        iconSpeedUp,
        () => setSpeed(increaseSpeed(speed)),
        'speed up',
      )}
      <div className="rt-tracker-speed">
        {iconSpeed}
        {`${speed < 1 ? speed.toFixed(1) : speed}`}
      </div>
    </div>
  );
}

TrackerControl.propTypes = {
  /**
   * CSS class of the tracker control.
   */
  className: PropTypes.string,

  /**
   * Icon of the date reset button.
   */
  iconDateReset: PropTypes.element,

  /**
   * Icon of the speed down button.
   */
  iconSpeedDown: PropTypes.element,

  /**
   * Icon of the speed up button.
   */
  iconSpeedUp: PropTypes.element,

  /**
   * Icon of the speed reset button.
   */
  iconSpeedReset: PropTypes.element,

  /**
   * Icon speed.
   */
  iconSpeed: PropTypes.element,

  /**
   * Render function for buttons.
   */
  renderButton: PropTypes.func,

  /**
   * Trackerlayer.
   */
  trackerLayer: PropTypes.instanceOf(TrackerLayer).isRequired,
};

TrackerControl.defaultProps = {
  className: 'rt-tracker-control',
  iconDateReset: <FaRegDotCircle />,
  iconSpeedDown: <FaBackward />,
  iconSpeedReset: <FaPlay />,
  iconSpeedUp: <FaForward />,
  iconSpeed: <IoIosSpeedometer />,
  renderButton: defaultRenderButton,
};

export default TrackerControl;
