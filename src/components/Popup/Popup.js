import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import { getCenter } from 'ol/extent';
import { unByKey } from 'ol/Observable';

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
   * Popup title.
   */
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

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
   * Title HTML attributes.
   */
  titles: PropTypes.shape({
    closeButton: PropTypes.string,
  }),

  /**
   * Function triggered on close button click.
   */
  onCloseClick: PropTypes.func,

  /**
   * HTML tabIndex attribute.
   */
  tabIndex: PropTypes.string,

  /**
   * Render the header
   */
  renderHeader: PropTypes.func,

  /**
   * Render the close button
   */
  renderCloseButton: PropTypes.func,

  /**
   * Render the footer
   */
  renderFooter: PropTypes.func,
};

const defaultProps = {
  header: null,
  feature: null,
  panIntoView: false,
  panRect: null,
  popupCoordinate: null,
  className: 'rs-popup',
  tabIndex: '',
  titles: { closeButton: 'Close' },
  onCloseClick: () => {},
  renderHeader: null,
  renderCloseButton: null,
  renderFooter: () => null,
};

class Popup extends PureComponent {
  static renderHeader(props) {
    const { header, renderCloseButton } = props;
    return (
      <div className="rs-popup-header">
        {header}
        {(renderCloseButton || Popup.renderCloseButton)(props)}
      </div>
    );
  }

  static renderCloseButton({ onCloseClick, titles }) {
    return (
      <div
        role="button"
        tabIndex={0}
        className="rs-popup-close-bt"
        title={titles.closeButton}
        aria-label={titles.closeButton}
        onClick={() => onCloseClick()}
        onKeyPress={evt => evt.which === 13 && onCloseClick()}
      >
        <MdClose focusable={false} />
      </div>
    );
  }

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

  render() {
    const {
      feature,
      popupCoordinate,
      children,
      header,
      titles,
      tabIndex,
      renderHeader,
      renderFooter,
      ...other
    } = this.props;

    if (!feature && !popupCoordinate) {
      return null;
    }

    delete other.panIntoView;
    delete other.panRect;
    delete other.map;
    delete other.header;
    delete other.onCloseClick;
    delete other.renderCloseButton;

    const { top, left } = this.state;

    // force re-render if the feature or the coordinate changes.
    // this is needed to update the popupElement ref
    const key = feature ? feature.getId() : popupCoordinate.join();
    return (
      <div
        className="rs-popup"
        style={{
          left,
          top,
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
      >
        <div
          className="rs-popup-container"
          tabIndex={tabIndex}
          role="dialog"
          key={key}
          ref={popupElement => {
            this.setState({ popupElement });
          }}
        >
          {(renderHeader || Popup.renderHeader)(this.props)}
          <div className="rs-popup-body">{children}</div>
          {renderFooter(this.props)}
        </div>
      </div>
    );
  }
}

Popup.propTypes = propTypes;
Popup.defaultProps = defaultProps;

export default Popup;
