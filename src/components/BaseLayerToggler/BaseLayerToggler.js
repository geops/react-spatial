import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import OLMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { containsExtent } from 'ol/extent';
import LayerService from '../../LayerService';
import Button from '../Button';
import Footer from '../Footer';
import BasicMap from '../BasicMap';
import MapboxLayer from '../../layers/MapboxLayer';

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

  /**
   * Path to the directory which includes the fallback images
   */
  fallbackImgDir: PropTypes.string,

  /**
   * Outside of this valid extent the fallback image is loaded
   */
  validExtent: PropTypes.arrayOf(PropTypes.number),
};

const defaultProps = {
  layerService: undefined,
  className: 'tm-base-layer-toggler',
  classNameItem: 'tm-base-layer-item',
  classNamePrevious: 'tm-base-layer-previous',
  classNameNext: 'tm-base-layer-next',
  fallbackImgDir: '../../images/baselayer/',
  validExtent: [-Infinity, -Infinity, Infinity, Infinity],
};

class BaseLayerToggler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: null,
      layerVisible: null,
      idx: 0,
      fallbackImg: null,
      fallbackImgOpacity: 0,
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

    if (layerVisible && !prevState.layerVisible) {
      this.next();
    } else if (layerVisible !== prevState.layerVisible) {
      this.toggle(prevState.layerVisible);
    }

    if (this.map && idx !== prevState.idx) {
      this.map.getLayers().clear();

      const children = layers[idx].getChildren();
      const childLayers = children.length ? children : [layers[idx]];

      childLayers.forEach(layer => {
        if (layer instanceof MapboxLayer) {
          const ml = layer.clone();
          ml.init(this.map); // Including addLayer
          ml.setVisible(true);
        } else {
          this.map.addLayer(
            new TileLayer({
              source: layer.olLayer.getSource(),
            }),
          );
        }
        this.checkExtent();
      });
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
    const baseLayers = layerService.getBaseLayers();
    const layers = baseLayers.length > 1 ? baseLayers : null;
    const idx = layers ? layers.findIndex(l => l.getVisible()) : 0;
    this.setState({
      layers,
      idx,
      layerVisible: layers ? layers[idx] : null,
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

    map.on('moveend', () => {
      this.checkExtent();
    });
  }

  toggle(layer) {
    const { layers } = this.state;

    let index = 0;
    while (layer !== layers[index]) {
      index += 1;
    }

    this.setState({
      idx: index,
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

  /**
   * Check if the next layer is inside the global extent.
   * If not, try setting a global image.
   */
  checkExtent() {
    const { validExtent, map, fallbackImgDir } = this.props;
    const { idx, layers, fallbackImg } = this.state;

    const nextLayer = layers[idx];
    let opacity = 0;
    let img = fallbackImg;
    let rect = null;

    if (this.ref && this.ref.current) {
      const elt = this.ref.current;
      rect = {
        top: elt.offsetTop,
        left: elt.offsetLeft,
        width: elt.offsetWidth,
        height: elt.offsetHeight,
      };
    }

    if (rect && nextLayer) {
      const tl = [rect.left, rect.top + rect.height];
      const br = [rect.left + rect.width, rect.top];
      const tlCoord = map.getCoordinateFromPixel(tl);
      const brCoord = map.getCoordinateFromPixel(br);
      if (!tlCoord || !brCoord) {
        return;
      }
      const spyExt = [tlCoord[0], tlCoord[1], brCoord[0], brCoord[1]];

      if (validExtent && !containsExtent(validExtent, spyExt)) {
        opacity = 1;
        img = `${fallbackImgDir}${nextLayer.getKey()}.png`;
      }
    }

    this.setState({
      fallbackImg: img,
      fallbackImgOpacity: opacity,
    });
  }

  render() {
    const {
      className,
      classNameItem,
      classNamePrevious,
      classNameNext,
    } = this.props;
    const { layers, idx, fallbackImg, fallbackImgOpacity } = this.state;

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
        <img
          src={fallbackImg}
          alt={fallbackImg}
          style={{ opacity: fallbackImgOpacity }}
          className={classNameItem}
        />
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
