import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import NorthArrowSimple from '../../images/northArrow.svg';
import NorthArrowCircle from '../../images/northArrowCircle.svg';

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
   * Display circle around the north arrow. Not used if pass children.
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
  className: 'tm-north-arrow',
  rotationOffset: 0,
  circled: false,
  children: null,
};

/**
 * This component displays an arrow pointing the North of the map.
 */
class NorthArrow extends PureComponent {
  static radToDeg(rad) {
    return (rad * 360) / (Math.PI * 2);
  }

  static getRotation(map, rotationOffset) {
    return NorthArrow.radToDeg(map.getView().getRotation()) + rotationOffset;
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
      rotation: NorthArrow.getRotation(evt.map, rotationOffset),
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
        {children || (circled ? <NorthArrowCircle /> : <NorthArrowSimple />)}
      </div>
    );
  }
}

NorthArrow.propTypes = propTypes;
NorthArrow.defaultProps = defaultProps;

export default NorthArrow;
