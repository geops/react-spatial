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
    const { zoomSlider } = this.props;
    if (zoomSlider) {
      this.displayZoomSlider();
    }
  }

  componentDidUpdate(prevProps) {
    const { zoomSlider } = this.props;
    if (prevProps.zoomSlider !== zoomSlider) {
      if (zoomSlider) {
        this.displayZoomSlider();
      } else {
        this.removeZoomSlider();
      }
    }
  }

  componentWillUnmount() {
    if (this.olZoomSlider) {
      this.removeZoomSlider();
    }
  }

  displayZoomSlider() {
    const { map } = this.props;
    this.olZoomSlider = new ZoomSlider();
    this.olZoomSlider.element.classList.remove('ol-control');
    // Unset tabIndex on zoom slider button.
    this.olZoomSlider.element.firstElementChild.tabIndex = -1;
    // Set the zoom slider in the custom control wrapper.
    this.olZoomSlider.setTarget(this.ref.current);
    map.addControl(this.olZoomSlider);
  }

  removeZoomSlider() {
    const { map } = this.props;
    map.removeControl(this.olZoomSlider);
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
          <div className="tm-zoomslider-wrapper" ref={this.ref} />
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
