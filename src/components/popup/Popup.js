import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import { getCenter } from 'ol/extent';
import { unByKey } from 'ol/Observable';
import Button from '../button/Button';

import './Popup.scss';

const propTypes = {
  children: PropTypes.node.isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  feature: PropTypes.instanceOf(Feature),
  className: PropTypes.string,
  onCloseClick: PropTypes.func,
  showCloseButton: PropTypes.bool,

  t: PropTypes.func,
};

const defaultProps = {
  feature: null,
  className: '',
  showCloseButton: true,
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
    this.postrenderKey = map.on(
      'postrender',
      this.updatePixelPosition.bind(this),
    );
  }

  componentDidUpdate(prevProps) {
    const { feature } = this.props;
    if (!prevProps.feature && feature) {
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
      const ext = feature.getGeometry().getExtent();
      const pos = map.getPixelFromCoordinate(getCenter(ext));
      this.setState({
        left: pos[0],
        top: pos[1],
      });
    }
  }

  renderCloseButton() {
    const { t, showCloseButton, onCloseClick } = this.props;

    if (!showCloseButton) {
      return null;
    }

    return (
      <Button
        className="tm-popup-close-button"
        title={`Popup ${t('Schliessen')}`}
        onClick={() => onCloseClick()}
      >
        <MdClose focusable={false} />
      </Button>
    );
  }

  render() {
    const { feature, className, children } = this.props;

    if (!feature) {
      return null;
    }

    const { top, left } = this.state;

    return (
      <div
        className="tm-popup-container"
        style={{
          position: 'absolute',
          left,
          top,
        }}
      >
        <div
          className={`tm-popup ${className}`}
          role="button"
          tabIndex={className === 'tm-tooltip' ? '0' : ''}
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
