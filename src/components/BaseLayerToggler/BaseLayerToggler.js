import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import OLMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import LayerService from '../../LayerService';
import Button from '../Button';
import Footer from '../Footer';
import BasicMap from '../BasicMap';

const propTypes = {
  /**
   * An ol map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * Layers provider.
   */
  layerService: PropTypes.instanceOf(LayerService),

  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * CSS class to apply on each item.
   */
  classNameItem: PropTypes.string,

  /**
   * CSS class to apply to the previous button.
   */
  classNamePrevious: PropTypes.string,

  /**
   * CSS class to apply to the next button.
   */
  classNameNext: PropTypes.string,
};

const defaultProps = {
  layerService: undefined,
  className: 'tm-base-layer-toggler',
  classNameItem: 'tm-base-layer-item',
  classNamePrevious: 'tm-base-layer-previous',
  classNameNext: 'tm-base-layer-next',
};

class BaseLayerToggler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: null,
      layerVisible: null,
      idx: 0,
    };
    this.map = null;
    this.ref = React.createRef();
  }

  componentDidMount() {
    const { layerService, map } = this.props;

    if (layerService) {
      this.updateLayerService();
    }

    if (map) {
      this.updateMap();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { layerService, map } = this.props;
    const { layerVisible, idx, layers } = this.state;

    if (layerService !== prevProps.layerService) {
      this.updateLayerService();
    }

    if (map !== prevProps.map) {
      this.updateMap();
    }

    if (layerVisible !== prevState.layerVisible) {
      this.next();
    }

    if (this.map && idx !== prevState.idx) {
      this.map.getLayers().clear();
      this.map.addLayer(
        new TileLayer({
          source: layers[idx].olLayer.getSource(),
        }),
      );
    }
  }

  updateLayerService() {
    const { layerService } = this.props;

    if (!layerService) {
      return;
    }

    this.updateState();
    layerService.on('change:visible', () => this.updateState());
  }

  updateState() {
    const { layerService } = this.props;
    const layers = layerService.getRadioGroupLayers('baseLayer');
    const idx = layers.findIndex(l => l.getVisible());
    this.setState({
      layers,
      idx,
      layerVisible: layers[idx],
    });
  }

  updateMap() {
    const { map } = this.props;
    if (!this.map) {
      this.map = new OLMap({ controls: [], interactions: [] });
    }
    this.map.setView(map.getView());

    map.on('postrender', e => {
      this.map.getView().setZoom(e.target.getView().getZoom());
      if (this.ref && this.ref.current) {
        const elt = this.ref.current;
        const coord = map.getCoordinateFromPixel([
          elt.offsetLeft + elt.offsetWidth / 2,
          elt.offsetTop + elt.offsetHeight / 2,
        ]);
        this.map.getView().setCenter(coord);
      }
    });
  }

  previous() {
    const { layers, layerVisible, idx } = this.state;
    let previousIdx = idx - 1;

    while (!layers[previousIdx] || layerVisible === layers[previousIdx]) {
      previousIdx -= 1;
      if (previousIdx < 0) {
        previousIdx = layers.length - 1;
      }
    }

    this.setState({
      idx: previousIdx,
    });
  }

  next() {
    const { layers, layerVisible, idx } = this.state;
    let nextIdx = idx + 1;

    while (!layers[nextIdx] || layerVisible === layers[nextIdx]) {
      nextIdx += 1;
      if (nextIdx >= layers.length) {
        nextIdx = 0;
      }
    }

    this.setState({
      idx: nextIdx,
    });
  }

  render() {
    const {
      className,
      classNameItem,
      classNamePrevious,
      classNameNext,
    } = this.props;
    const { layers, idx } = this.state;

    let footer = null;

    if (!layers || layers.length < 2) {
      return null;
    }

    if (layers.length > 2) {
      footer = (
        <Footer>
          <Button className={classNamePrevious} onClick={() => this.previous()}>
            <FaArrowCircleLeft />
          </Button>
          <Button className={classNameNext} onClick={() => this.next()}>
            <FaArrowCircleRight />
          </Button>
        </Footer>
      );
    }

    const nextLayer = layers[idx];

    return (
      <div className={className} ref={this.ref}>
        <BasicMap map={this.map} />

        <Button
          className={classNameItem}
          onClick={() => nextLayer.setVisible(true)}
        />

        {footer}
      </div>
    );
  }
}

BaseLayerToggler.propTypes = propTypes;
BaseLayerToggler.defaultProps = defaultProps;

export default BaseLayerToggler;
