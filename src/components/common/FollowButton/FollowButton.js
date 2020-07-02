import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { TrackerLayer } from 'mobility-toolbox-js/src/ol/';

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
  className: 'rt-control-button rt-route-follow',
  title: 'Follow',
};

/**
 * Button enables the follow of a selected train.
 */
class FollowButton extends PureComponent {
  componentDidUpdate(prevProps) {
    const { routeIdentifier } = this.props;
    if (routeIdentifier !== prevProps.routeIdentifier) {
      this.changeRouteIdentifier();
    }
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
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

  toggleFollow(routeIdentifier) {
    const { trackerLayer, active, onClick } = this.props;

    const activated = !active;

    if (activated && trackerLayer && trackerLayer.tracker) {
      this.centerOnTrajectory(routeIdentifier);
      this.updateInterval = window.setInterval(() => {
        this.centerOnTrajectory(routeIdentifier);
      }, 50);
    } else {
      clearInterval(this.updateInterval);
    }

    onClick(activated);
  }

  changeRouteIdentifier() {
    const { onClick } = this.props;
    clearInterval(this.updateInterval);
    onClick(false);
  }

  render() {
    const { className, title, routeIdentifier, active, children } = this.props;
    const toggle = () => this.toggleFollow(routeIdentifier);

    return (
      <div
        aria-label={title}
        className={`${className}${active ? ' rt-active' : ' rt-inactive'}`}
        title={title}
        onClick={toggle}
        onKeyPress={(e) => e.which === 13 && toggle()}
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
