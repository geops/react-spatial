import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import { getCenter } from 'ol/extent';
import { unByKey } from 'ol/Observable';
import Button from '../Button';

const propTypes = {
  children: PropTypes.node.isRequired,
  map: PropTypes.instanceOf(OLMap).isRequired,
  feature: PropTypes.instanceOf(Feature),
  /**
   * If true, the popup is panned in the map's viewport.
   */
  panIntoView: PropTypes.bool,
  /**
   * Custom BoundingClientRect to fit popup into.
   * Use if panIntoView is true. Default is the map's BoundingClientRect.
   */
  panRect: PropTypes.arrayOf(PropTypes.number),
  popupCoordinate: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  classNameCloseBt: PropTypes.string,
  onCloseClick: PropTypes.func,
  onKeyUp: PropTypes.func,
  showCloseButton: PropTypes.bool,

  t: PropTypes.func,
};

const defaultProps = {
  feature: null,
  panIntoView: false,
  panRect: null,
  popupCoordinate: null,
  className: 'tm-popup',
  classNameCloseBt: 'tm-button tm-popup-close-bt',
  showCloseButton: true,
  onKeyUp: () => {},
  onCloseClick: () => {},
  t: p => p,
};

class Popup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      popupElement: null,
      top: 0,
      left: 0,
    };
    this.postrenderKey = null;
  }

  componentDidMount() {
    const { map } = this.props;
    this.updatePixelPosition();

    this.postrenderKey = map.on('postrender', () => {
      this.updatePixelPosition();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { feature, panIntoView, popupCoordinate } = this.props;
    const { popupElement } = this.state;
    if (
      feature !== prevProps.feature ||
      popupCoordinate !== prevProps.popupCoordinate
    ) {
      this.updatePixelPosition();
    }

    if (
      panIntoView &&
      popupElement &&
      popupElement !== prevState.popupElement
    ) {
      this.panIntoView();
    }
  }

  componentWillUnmount() {
    unByKey(this.postrenderKey);
  }

  panIntoView() {
    const { map, panRect } = this.props;
    const { popupElement } = this.state;

    const mapRect = panRect || map.getTarget().getBoundingClientRect();
    const popupRect = popupElement.getBoundingClientRect();
    const [x, y] = map.getView().getCenter();
    const res = map.getView().getResolution();
    const newCenter = [x, y];

    if (mapRect.top > popupRect.top) {
      newCenter[1] = y + (mapRect.top - popupRect.top) * res;
    }

    if (mapRect.left > popupRect.left) {
      newCenter[0] = x - (mapRect.left - popupRect.left) * res;
    }

    if (mapRect.right < popupRect.right) {
      newCenter[0] = x + (popupRect.right - mapRect.right) * res;
    }

    if (mapRect.bottom < popupRect.bottom) {
      newCenter[1] = y - (popupRect.bottom - mapRect.bottom) * res;
    }

    if (newCenter[0] !== x || newCenter[1] !== y) {
      map.getView().animate({ center: newCenter, duration: 500 });
    }
  }

  updatePixelPosition() {
    const { map, feature, popupCoordinate } = this.props;
    let coord = popupCoordinate;

    if (feature && !coord) {
      coord = getCenter(feature.getGeometry().getExtent());
    }

    if (coord) {
      const pos = map.getPixelFromCoordinate(coord);

      if (pos && pos.length === 2) {
        this.setState({
          left: pos[0],
          top: pos[1],
        });
      }
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
      popupCoordinate,
      className,
      children,
      onKeyUp,
    } = this.props;

    if (!feature && !popupCoordinate) {
      return null;
    }

    const { top, left } = this.state;

    return (
      <div
        className={className}
        style={{
          left,
          top,
        }}
      >
        <div
          role="button"
          ref={popupElement => {
            this.setState({ popupElement });
          }}
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
