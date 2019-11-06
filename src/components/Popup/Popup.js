import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import { getCenter } from 'ol/extent';
import { unByKey } from 'ol/Observable';
import Button from '../Button';

const propTypes = {
  /**
   * React Children.
   */
  children: PropTypes.node.isRequired,

  /**
   * Openlayers Map (https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Openlayers Feature (https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html).
   */
  feature: PropTypes.instanceOf(Feature),

  /**
   * If true, the popup is panned in the map's viewport.
   */
  panIntoView: PropTypes.bool,

  /**
   * Custom BoundingClientRect to fit popup into.
   * Use if panIntoView is true. Default is the map's BoundingClientRect.
   */
  panRect: PropTypes.objectOf(PropTypes.number),

  /**
   * Coordinate position of the popup.
   */
  popupCoordinate: PropTypes.arrayOf(PropTypes.number),

  /**
   * Class name of the popup.
   */
  className: PropTypes.string,

  /**
   * Class name of the popup close button.
   */
  classNameCloseBt: PropTypes.string,

  /**
   * Function triggered on close button click.
   */
  onCloseClick: PropTypes.func,

  /**
   * Function triggered on key up.
   */
  onKeyUp: PropTypes.func,

  /**
   * Popup title.
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * Popup padding.
   */
  padding: PropTypes.string,

  /**
   * HTML tabIndex attribute.
   */
  tabIndex: PropTypes.string,

  /**
   * Hide or show the header.
   */
  showHeader: PropTypes.bool,

  /**
   * Hide or show close button.
   */
  showCloseButton: PropTypes.bool,

  /**
   * Translation function.
   * @param {function} Translation function returning the translated string.
   */
  t: PropTypes.func,
};

const defaultProps = {
  feature: null,
  panIntoView: false,
  panRect: null,
  popupCoordinate: null,
  className: 'rs-popup',
  classNameCloseBt: 'rs-popup-close-bt',
  showCloseButton: true,
  showHeader: true,
  title: null,
  padding: '10px',
  tabIndex: '',
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
      (popupElement !== prevState.popupElement || feature !== prevProps.feature)
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

  renderPopupHeader() {
    const {
      t,
      title,
      showCloseButton,
      onCloseClick,
      classNameCloseBt,
    } = this.props;

    return (
      <div className="rs-popup-header">
        {t(title)}
        {showCloseButton ? (
          <Button
            className={classNameCloseBt}
            title={`Popup ${t('Schliessen')}`}
            onClick={() => onCloseClick()}
          >
            <MdClose focusable={false} />
          </Button>
        ) : null}
      </div>
    );
  }

  render() {
    const {
      feature,
      showHeader,
      popupCoordinate,
      className,
      children,
      onKeyUp,
      padding,
      tabIndex,
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
          role="presentation"
          ref={popupElement => {
            this.setState({ popupElement });
          }}
          tabIndex={tabIndex}
          onKeyUp={e => {
            onKeyUp(e);
          }}
        >
          {showHeader ? this.renderPopupHeader() : null}
          <div
            style={{
              padding,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Popup.propTypes = propTypes;
Popup.defaultProps = defaultProps;

export default Popup;
