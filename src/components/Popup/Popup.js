import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { getCenter } from 'ol/extent';
import { unByKey } from 'ol/Observable';
import Button from '../Button';

const propTypes = {
  children: PropTypes.node.isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  feature: PropTypes.instanceOf(Feature),
  className: PropTypes.string,
  classNameCloseBt: PropTypes.string,

  /**
   * Additional CSS class for small screen widths (mobile).
   */
  classNameMobile: PropTypes.string,

  onCloseClick: PropTypes.func,
  onKeyUp: PropTypes.func,
  showCloseButton: PropTypes.bool,

  /**
   * Threshold for small screen widths (mobile)
   * which are smaller than this value
   */
  innerWidthMobile: PropTypes.number,
  t: PropTypes.func,
};

const defaultProps = {
  feature: null,
  className: 'tm-popup',
  classNameCloseBt: 'tm-button tm-popup-close-bt',
  classNameMobile: 'mobile',
  showCloseButton: true,
  innerWidthMobile: 500,
  onKeyUp: () => {},
  onCloseClick: () => {},
  t: p => p,
};

class Popup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      top: 0,
      left: 0,
    };
    this.postrenderKey = null;
  }

  componentDidMount() {
    const { map } = this.props;
    this.postrenderKey = map.on('postrender', () => {
      this.updatePosition();
    });
  }

  componentDidUpdate() {
    const { feature } = this.props;
    if (feature) {
      // Initialize the position.
      this.updatePosition();
    }
  }

  componentWillUnmount() {
    unByKey(this.postrenderKey);
  }

  updatePosition() {
    const { map, feature, innerWidthMobile } = this.props;
    const isMobile = window.innerWidth < innerWidthMobile;
    if (isMobile) {
      this.setState({
        isMobile,
      });
    } else if (feature) {
      let coord;
      const geom = feature.getGeometry();
      if (geom instanceof Point) {
        coord = geom.getCoordinates();
      } else {
        coord = getCenter(geom.getExtent());
      }
      const pos = map.getPixelFromCoordinate(coord);
      this.setState({
        isMobile,
        left: pos[0],
        top: pos[1],
      });
    }
  }

  renderCloseButton() {
    const { t, showCloseButton, onCloseClick, classNameCloseBt } = this.props;

    if (!showCloseButton) {
      return null;
    }

    return (
      <Button
        className={classNameCloseBt}
        title={`Popup ${t('Schliessen')}`}
        onClick={() => onCloseClick()}
      >
        <MdClose focusable={false} />
      </Button>
    );
  }

  render() {
    const {
      feature,
      className,
      classNameMobile,
      children,
      onKeyUp,
    } = this.props;

    if (!feature) {
      return null;
    }

    const { top, left, isMobile } = this.state;

    const style = isMobile
      ? {}
      : {
          left,
          top,
        };

    return (
      <div
        className={`${className} ${isMobile ? classNameMobile : ''}`}
        style={style}
      >
        <div
          role="button"
          tabIndex={className === 'tm-tooltip' ? '0' : ''}
          onKeyUp={e => {
            onKeyUp(e);
          }}
        >
          {this.renderCloseButton()}
          {children}
        </div>
      </div>
    );
  }
}

Popup.propTypes = propTypes;
Popup.defaultProps = defaultProps;

export default Popup;
