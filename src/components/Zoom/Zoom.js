import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { ZoomSlider } from 'ol/control';
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

  /**
   * Display a slider to zoom.
   */
  zoomSlider: PropTypes.bool,
};

const defaultProps = {
  zoomInTitle: 'Zoom in',
  zoomOutTitle: 'Zoom out',
  className: 'tm-zooms-bar',
  zoomInClassName: 'tm-button tm-round-blue',
  zoomOutClassName: 'tm-button tm-round-blue',
  zoomInChildren: <FaPlus focusable={false} />,
  zoomOutChildren: <FaMinus focusable={false} />,
  zoomSlider: false,
};

/**
 * This component creates a zoom wrapper.
 */
class Zoom extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const { map, zoomSlider } = this.props;
    const olZoomSlider = zoomSlider ? new ZoomSlider() : null;

    if (olZoomSlider) {
      olZoomSlider.element.classList.remove('ol-control');
      // Set the zoom slider in the custom control wrapper.
      olZoomSlider.setTarget(this.ref.current);
      map.addControl(olZoomSlider);
    }
  }

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
      zoomSlider,
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
        {zoomSlider ? (
          <div className="wkp-zoomslider-wrapper" ref={this.ref} />
        ) : null}
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
