import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ArrowNorthSimple from '../../images/arrowNorth.svg';
import ArrowNorthCircle from '../../images/arrowNorthCircle.svg';

const propTypes = {
  /**
   * CSS class of the button.
   */
  className: PropTypes.string,

  /**
   * Rotation of the north arrow in degrees.
   */
  rotationOffset: PropTypes.number,

  /**
   * Display circle around the north arrow.
   */
  circled: PropTypes.bool,
};

const defaultProps = {
  className: 'tm-arrow-north',
  rotationOffset: 0,
  circled: false,
};

/**
 * This component displays an arrow pointing the North of the map.
 */
class ArrowNorth extends PureComponent {
  render() {
    const { className, circled, rotationOffset } = this.props;

    return (
      <div
        className={className}
        style={{ transform: `rotate(${rotationOffset}deg)` }}
      >
        {circled ? (
          <ArrowNorthCircle className={className} />
        ) : (
          <ArrowNorthSimple className={className} />
        )}
      </div>
    );
  }
}

ArrowNorth.propTypes = propTypes;
ArrowNorth.defaultProps = defaultProps;

export default ArrowNorth;
