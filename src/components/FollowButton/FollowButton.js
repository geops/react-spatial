import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TrackerLayer } from 'mobility-toolbox-js/ol/';

const propTypes = {
  /**
   * CSS class of the follow button.
   */
  className: PropTypes.string,

  /**
   * Title.
   */
  title: PropTypes.string,

  /**
   * Line info route identifer.
   */
  routeIdentifier: PropTypes.string.isRequired,

  /**
   * Button is active.
   */
  active: PropTypes.bool.isRequired,

  /**
   * Function triggered on button click.
   */
  onClick: PropTypes.func.isRequired,

  /**
   * Trackerlayer.
   */
  trackerLayer: PropTypes.instanceOf(TrackerLayer).isRequired,

  /**
   * Function to set the map center, Used to follow a train.
   */
  setCenter: PropTypes.func.isRequired,

  /**
   * Children content of the button.
   */
  children: PropTypes.element.isRequired,
};

const defaultProps = {
  className: 'rt-route-follow',
  title: 'Follow',
};

/**
 * Button enables the follow of a selected train.
 */
class FollowButton extends PureComponent {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { routeIdentifier, active, trackerLayer, onClick } = this.props;

    if (routeIdentifier !== prevProps.routeIdentifier) {
      onClick(false);
    }

    if (active !== prevProps.active) {
      if (active && trackerLayer) {
        this.centerOnTrajectory(routeIdentifier);
        this.updateInterval = window.setInterval(() => {
          this.centerOnTrajectory(routeIdentifier);
        }, 50);
      } else {
        clearInterval(this.updateInterval);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  onClick() {
    const { active, onClick } = this.props;
    onClick(!active);
  }

  centerOnTrajectory(routeIdentifier) {
    const { trackerLayer, setCenter } = this.props;

    const [trajectory] = trackerLayer.getVehicle(
      (r) => r.routeIdentifier === routeIdentifier,
    );
    const firstCoord = trajectory && trajectory.coordinate;
    if (firstCoord) {
      setCenter(firstCoord);
    }
  }

  render() {
    const { className, title, active, children } = this.props;

    return (
      <div
        aria-label={title}
        className={`${className}${active ? ' rt-active' : ''}`}
        title={title}
        onClick={this.onClick}
        onKeyPress={(e) => e.which === 13 && this.onClick}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    );
  }
}

FollowButton.propTypes = propTypes;
FollowButton.defaultProps = defaultProps;

export default FollowButton;
