import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import OLMap from 'ol/Map';
import { unByKey } from 'ol/Observable';
import TileLayer from 'ol/layer/Tile';
import { containsExtent } from 'ol/extent';
import LayerService from '../../LayerService';
import BasicMap from '../BasicMap';

const propTypes = {
  /**
   * An ol.Map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * LayerService.
   */
  layerService: PropTypes.instanceOf(LayerService),

  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * Path to the directory which includes the fallback images
   */
  fallbackImgDir: PropTypes.string,

  /**
   * Outside of this valid extent the fallback image is loaded
   */
  validExtent: PropTypes.arrayOf(PropTypes.number),

  /**
   * Button titles.
   */
  titles: PropTypes.shape({
    button: PropTypes.string,
    prevButton: PropTypes.stirng,
    nextButton: PropTypes.string,
  }),
};

const defaultProps = {
  layerService: undefined,
  className: 'rs-base-layer-toggler',
  fallbackImgDir: '../../images/baselayer/',
  validExtent: [-Infinity, -Infinity, Infinity, Infinity],
  titles: {
    button: 'Toggle base layer',
    nextButton: 'Next base layer',
    prevButton: 'Previous base layer',
  },
};

class BaseLayerToggler extends Component {
  static isDifferentLayers(prevLayers, layers) {
    if (prevLayers && layers) {
      return (
        JSON.stringify(prevLayers.map((l) => l.getKey())) !==
        JSON.stringify(layers.map((l) => l.getKey()))
      );
    }
    return false;
  }

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

    this.updateState = this.updateState.bind(this);
    this.resetState = this.resetState.bind(this);
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
    } else if (
      layerVisible !== prevState.layerVisible &&
      layers.includes(prevState.layerVisible)
    ) {
      // In case the visibility of the background Layer is change from another component.
      this.toggle(prevState.layerVisible);
    }

    if (
      this.map &&
      (idx !== prevState.idx ||
        BaseLayerToggler.isDifferentLayers(prevState.layers, layers))
    ) {
      this.map.getLayers().clear();

      if (!layers.length) {
        return;
      }
      let children = [];
      let childLayers = [];
      if (idx !== null && idx < layers.length) {
        children = layers[idx].getChildren();
        childLayers = children.length ? children : [layers[idx]];
      }

      childLayers.forEach((layer) => {
        if (layer.clone) {
          let ml;
          // MapboxStyleLayer
          if (layer.mapboxLayer) {
            ml = layer.mapboxLayer.clone();
            ml.init(this.map); // Including addLayer
            ml.setVisible(true);
          }
          const cloned = layer.clone(ml);
          cloned.init(this.map); // Including addLayer
          cloned.setVisible(true);
        } else if (layer.olLayer && layer.olLayer instanceof TileLayer) {
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

  componentWillUnmount() {
    const { layerService } = this.props;
    unByKey([this.postRenderKey, this.moveEndKey]);
    layerService.un('change:visible', this.updateState);
    layerService.un('change:layers', this.resetState);
  }

  setNextVisible(nextLayer) {
    const { layers } = this.state;
    // Unset visibility to all layers before showing the next layer.
    layers.forEach(
      (l) => l.getVisible() && l.setVisible(false, true, true, true),
    );
    nextLayer.setVisible(true);
  }

  updateLayerService() {
    const { layerService } = this.props;

    if (!layerService) {
      return;
    }
    layerService.un('change:visible', this.updateState);
    layerService.un('change:layers', this.resetState);
    this.updateState();
    layerService.on('change:visible', this.updateState);
    layerService.on('change:layers', this.resetState);
  }

  updateState(evtLayer) {
    if (evtLayer && !evtLayer.getIsBaseLayer()) {
      return;
    }

    const { layerService } = this.props;
    const { idx } = this.state;

    const layers = layerService.getBaseLayers() || [];
    let newIdx = idx;
    if (newIdx === -1 && layers.length > 1) {
      newIdx = 0;
      layers[idx].setVisible(true);
    }

    this.setState({
      layers,
      idx: newIdx,
      layerVisible: layers.length > 1 ? layers[newIdx] : null,
    });
  }

  resetState() {
    const { layerService } = this.props;
    const { layerVisible } = this.state;

    const layers = layerService.getBaseLayers() || [];
    const idx = layerVisible ? layers.indexOf(layerVisible) : -1;
    let newIdx;

    if (idx === -1) {
      newIdx = 1;
    } else if (idx === layers.length - 1) {
      newIdx = 0;
    } else {
      newIdx = idx + 1;
    }

    this.setState({
      layers,
      idx: layers.length > 1 ? newIdx : null,
    });
  }

  updateMap() {
    const { map } = this.props;
    if (!this.map) {
      this.map = new OLMap({ controls: [], interactions: [] });
    }
    unByKey([this.postRenderKey, this.moveEndKey]);
    this.postRenderKey = map.on('postrender', (e) => {
      this.map.getView().setZoom(e.target.getView().getZoom());
      if (this.ref && this.ref.current) {
        const elt = this.ref.current;
        const coord = map.getCoordinateFromPixel([
          elt.offsetLeft + elt.offsetWidth / 2,
          elt.offsetTop + elt.offsetHeight / 2,
        ]);

        // In some case the map is not able to get the coord.
        // For example if the map has a width or height of 0.
        if (!coord) {
          return;
        }

        this.map.getView().setCenter(coord);
      }
    });

    this.moveEndKey = map.on('moveend', () => {
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

    if (validExtent && this.ref && this.ref.current && nextLayer) {
      const elt = this.ref.current;
      const blCoord = map.getCoordinateFromPixel([
        elt.offsetLeft,
        elt.offsetTop + elt.offsetHeight,
      ]);
      const trCoord = map.getCoordinateFromPixel([
        elt.offsetLeft + elt.offsetWidth,
        elt.offsetTop,
      ]);

      if (!blCoord || !trCoord) {
        return;
      }

      if (!containsExtent(validExtent, [...blCoord, ...trCoord])) {
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
    const { className, titles } = this.props;
    const { layers, idx, fallbackImg, fallbackImgOpacity } = this.state;

    let footer = null;

    if (!layers || layers.length < 2) {
      return null;
    }

    if (layers.length > 2) {
      footer = (
        <div className="rs-base-layer-footer">
          <div
            className="rs-base-layer-previous"
            role="button"
            onClick={() => this.previous()}
            onKeyPress={(e) => e.which === 13 && this.previous()}
            tabIndex="0"
            title={titles.prevButton}
          >
            <FaArrowCircleLeft focusable={false} />
          </div>
          <div
            className="rs-base-layer-next"
            role="button"
            onClick={() => this.next()}
            onKeyPress={(e) => e.which === 13 && this.next()}
            tabIndex="0"
            title={titles.nextButton}
          >
            <FaArrowCircleRight focusable={false} />
          </div>
        </div>
      );
    }

    const nextLayer = layers[idx];

    return (
      <div className={className} ref={this.ref}>
        <div
          className="rs-base-layer-toggle-button"
          role="button"
          title={titles.button}
          onClick={() => this.setNextVisible(nextLayer)}
          onKeyPress={(e) => e.which === 13 && this.setNextVisible(nextLayer)}
          tabIndex="0"
        >
          <img
            src={fallbackImg}
            alt={fallbackImg}
            style={{ opacity: fallbackImgOpacity }}
            className="rs-base-layer-image"
          />
          <BasicMap
            map={this.map}
            className="rs-base-layer-map"
            tabIndex={-1}
          />
        </div>
        {footer}
      </div>
    );
  }
}

BaseLayerToggler.propTypes = propTypes;
BaseLayerToggler.defaultProps = defaultProps;

export default BaseLayerToggler;
