import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import OLMap from 'ol/Map';
import Button from '../Button';

const propTypes = {
  /**
   * An ol map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Title for the zoom in button.
   */
  zoomInTitle: PropTypes.string,

  /**
   * Title for the zoom out button.
   */
  zoomOutTitle: PropTypes.string,

  /**
   * CSS class of the button.
   */
  className: PropTypes.string,

  /**
   * CSS class of the zoom in button.
   */
  zoomInClassName: PropTypes.string,

  /**
   * CSS class of the zoom out button.
   */
  zoomOutClassName: PropTypes.string,

  /**
   * Children content of the zoom in button.
   */
  zoomInChildren: PropTypes.node,

  /**
   * Children content of the zoom out button.
   */
  zoomOutChildren: PropTypes.node,
};

const defaultProps = {
  zoomInTitle: 'Zoom in',
  zoomOutTitle: 'Zoom out',
  className: 'tm-zooms-bar',
  zoomInClassName: 'tm-button tm-round-blue',
  zoomOutClassName: 'tm-button tm-round-blue',
  zoomInChildren: <FaPlus focusable={false} />,
  zoomOutChildren: <FaMinus focusable={false} />,
};

/**
 * This component creates a zoom wrapper.
 */
class Zoom extends Component {
  updateZoom(zoomAction) {
    const { map } = this.props;
    map.getView().cancelAnimations();
    const zoom = map.getView().getZoom();

    map.getView().animate({
      zoom: zoom + zoomAction,
    });
  }

  render() {
    const {
      zoomInTitle,
      zoomOutTitle,
      className,
      zoomInClassName,
      zoomOutClassName,
      zoomInChildren,
      zoomOutChildren,
    } = this.props;

    return (
      <div className={className}>
        <Button
          className={zoomInClassName}
          title={zoomInTitle}
          onClick={() => this.updateZoom(1)}
        >
          {zoomInChildren}
        </Button>
        <Button
          className={zoomOutClassName}
          title={zoomOutTitle}
          onClick={() => this.updateZoom(-1)}
        >
          {zoomOutChildren}
        </Button>
      </div>
    );
  }
}

Zoom.propTypes = propTypes;
Zoom.defaultProps = defaultProps;

export default Zoom;
