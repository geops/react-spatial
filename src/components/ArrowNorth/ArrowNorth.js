import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
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

  /**
   *  Children content of the north arrow.
   */
  children: PropTypes.element,

  /**
   * An ol map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,
};

const defaultProps = {
  className: 'tm-arrow-north',
  rotationOffset: 0,
  circled: false,
  children: null,
};

/**
 * This component displays an arrow pointing the North of the map.
 */
class ArrowNorth extends PureComponent {
  static radToDeg(rad) {
    return (rad * 360) / (Math.PI * 2);
  }

  constructor(props) {
    super(props);
    const { map, rotationOffset } = this.props;
    this.state = {
      rotation: map.getView().getRotation() + rotationOffset,
    };

    map.on('postrender', e => this.onRotate(e));
  }

  onRotate(evt) {
    const { rotationOffset } = this.props;

    this.setState({
      rotation:
        ArrowNorth.radToDeg(evt.map.getView().getRotation()) + rotationOffset,
    });
  }

  render() {
    const { className, circled, children } = this.props;
    const { rotation } = this.state;

    return (
      <div
        className={className}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {children || (circled ? <ArrowNorthCircle /> : <ArrowNorthSimple />)}
      </div>
    );
  }
}

ArrowNorth.propTypes = propTypes;
ArrowNorth.defaultProps = defaultProps;

export default ArrowNorth;
