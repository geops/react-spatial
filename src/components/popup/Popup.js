import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { getCenter } from 'ol/extent';
import { unByKey } from 'ol/Observable';
import Button from '../button/Button';

const propTypes = {
  children: PropTypes.node.isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  feature: PropTypes.instanceOf(Feature),
  className: PropTypes.string,
  classNameCloseBt: PropTypes.string,
  onCloseClick: PropTypes.func,
  onKeyUp: PropTypes.func,
  showCloseButton: PropTypes.bool,

  t: PropTypes.func,
};

const defaultProps = {
  feature: null,
  className: 'tm-popup',
  classNameCloseBt: 'tm-popup-close-bt',
  showCloseButton: true,
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
      this.updatePixelPosition();
    });
  }

  componentDidUpdate() {
    const { feature } = this.props;
    if (feature) {
      // Initialize the position.
      this.updatePixelPosition();
    }
  }

  componentWillUnmount() {
    unByKey(this.postrenderKey);
  }

  updatePixelPosition() {
    const { map, feature } = this.props;
    if (feature) {
      let coord;
      const geom = feature.getGeometry();
      if (geom instanceof Point) {
        coord = geom.getCoordinates();
      } else {
        coord = getCenter(geom.getExtent());
      }
      const pos = map.getPixelFromCoordinate(coord);
      this.setState({
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
    const { feature, className, children, onKeyUp } = this.props;

    if (!feature) {
      return null;
    }

    const { top, left } = this.state;

    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          left,
          top,
        }}
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
