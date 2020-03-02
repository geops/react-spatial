import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defaults as defaultInteractions } from 'ol/interaction';
import { equals } from 'ol/extent';
import OLMap from 'ol/Map';
import OLCollection from 'ol/Collection';
import View from 'ol/View';
import { unByKey } from 'ol/Observable';
import Interaction from 'ol/interaction/Interaction';
import Layer from '../../layers/Layer';
import ResizeHandler from '../ResizeHandler';

const propTypes = {
  /** Map animation options */
  animationOptions: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number),
    resolution: PropTypes.number,
    zoom: PropTypes.number,
  }),

  /** Center of the ol.View. */
  center: PropTypes.arrayOf(PropTypes.number),

  /** Class name of the map container */
  className: PropTypes.string,

  /** Map extent */
  extent: PropTypes.arrayOf(PropTypes.number),

  /** Openlayers fit options (https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit) when extent is updated */
  fitOptions: PropTypes.shape(),

  /** Array of [ol/interaction]. */
  interactions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Interaction)),
    PropTypes.instanceOf(OLCollection),
  ]),

  /** Array of Layer to display. */
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),

  /** An existing [ol/Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html). */
  map: PropTypes.instanceOf(OLMap),

  /**
   * Callback when a [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html) is clicked.
   * @param {OLFeature[]} features An array of [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html).
   * @param {ol.MapBrowserEvent} event The singleclick [ol/MapBrowserEvent](https://openlayers.org/en/latest/apidoc/module-ol_MapBrowserEvent-MapBrowserEvent.html#event:singleclick).
   */
  onFeaturesClick: PropTypes.func,

  /**
   * Callback when a [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html) is hovered.
   * @param {OLFeature[]} features An array of [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html).
   * @param {ol.MapBrowserEvent} event The pointermove [ol/MapBrowserEvent](https://openlayers.org/en/latest/apidoc/module-ol_MapBrowserEvent-MapBrowserEvent.html#event:pointermove).
   */
  onFeaturesHover: PropTypes.func,

  /**
   * Callback when the map was moved.
   * @param {ol.MapEvent} event The movend [ol/MapEvent](https://openlayers.org/en/latest/apidoc/module-ol_MapBrowserEvent-MapBrowserEvent.html#event:moveend).
   */
  onMapMoved: PropTypes.func,

  /** Map resolution */
  resolution: PropTypes.number,

  /** The tabIndex of the map. */
  tabIndex: PropTypes.number,

  /** HTML aria-label. */
  ariaLabel: PropTypes.string,

  /** View constructor options */
  viewOptions: PropTypes.shape({
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    extent: PropTypes.array,
    projection: PropTypes.string,
  }),

  /** Map zoom level */
  zoom: PropTypes.number,
};

const defaultProps = {
  animationOptions: undefined,
  center: [0, 0],
  className: 'rs-map',
  extent: undefined,
  fitOptions: {
    duration: 1000,
    padding: [20, 20, 20, 20],
    maxZoom: 23,
  },
  interactions: null,
  layers: [],
  map: null,
  onFeaturesClick: () => {},
  onFeaturesHover: undefined,
  onMapMoved: () => {},
  resolution: undefined,
  tabIndex: 0,
  ariaLabel: 'map',
  viewOptions: {
    minZoom: 0,
    maxZoom: 22,
    extent: undefined,
    projection: 'EPSG:3857',
  },
  zoom: 1,
};

/**
 * Display an OpenLayers Map.
 *
 * The map's view is created with the following parameters for the view:
 *  - projection: 'EPSG:3857'
 *  - zoom: 0
 *  - minZoom: 0
 *  - maxZoom: 22
 *
 * These options can be overrided by the viewOptions property.
 *
 */
class BasicMap extends Component {
  constructor(props) {
    super(props);
    const {
      center,
      extent,
      map,
      interactions,
      onMapMoved,
      resolution,
      viewOptions,
      zoom,
    } = this.props;

    this.map =
      map ||
      new OLMap({
        controls: [],
        interactions:
          interactions ||
          defaultInteractions({
            altShiftDragRotate: false,
            pinchRotate: false,
          }),
      });
    const view = new View({ ...viewOptions, ...{ center, zoom, resolution } });

    this.map.setView(view);

    this.node = React.createRef();

    if (extent) {
      this.map.getView().fit(extent);
    }

    this.moveEndRef = this.map.on('moveend', e => onMapMoved(e));
    this.singleClickRef = null;
    this.pointerMoveRef = null;
    this.layers = [];
  }

  componentDidMount() {
    const { onFeaturesClick, onFeaturesHover, layers } = this.props;
    this.map.setTarget(this.node.current);
    // Since ol 6.1.0 touch-action is set to auto and creates a bad navigation experience on mobile,
    // so we have to force it to none for mobile.
    // https://github.com/openlayers/openlayers/pull/10187/files
    const viewPort = this.map.getViewport();
    viewPort.style.touchAction = 'none';
    viewPort.style.msTouchAction = 'none';
    viewPort.setAttribute('touch-action', 'none');

    if (layers.length) {
      this.setLayers(layers);
    }

    this.singleClickRef = this.map.on('singleclick', evt => {
      const features = evt.map.getFeaturesAtPixel(evt.pixel);
      onFeaturesClick(features || [], evt);
    });

    if (onFeaturesHover) {
      this.pointerMoveRef = this.map.on('pointermove', evt => {
        const features = this.map.getFeaturesAtPixel(evt.pixel);
        onFeaturesHover(features || [], evt);
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      animationOptions,
      center,
      extent,
      fitOptions,
      layers,
      resolution,
      viewOptions,
      zoom,
    } = this.props;

    if (animationOptions && prevProps.animationOptions !== animationOptions) {
      this.map.getView().animate(animationOptions);
    }

    if (prevProps.layers !== layers) {
      this.setLayers(layers);
    }

    if (prevProps.center !== center) {
      this.map.getView().setCenter(center);
    }

    if (prevProps.extent !== extent) {
      this.map.getView().fit(extent, fitOptions);
    }

    if (prevProps.zoom !== zoom) {
      this.map.getView().setZoom(zoom);
    }

    if (
      prevProps.resolution !== resolution &&
      this.map.getView().getResolution() !== resolution
    ) {
      this.map.getView().setResolution(resolution);
    }

    if (
      (viewOptions &&
        viewOptions.extent &&
        (!prevProps.viewOptions.extent ||
          (prevProps.viewOptions.extent &&
            !equals(prevProps.viewOptions.extent, viewOptions.extent)))) ||
      (viewOptions.maxZoom &&
        prevProps.viewOptions.maxZoom !== viewOptions.maxZoom) ||
      (viewOptions.minZoom &&
        prevProps.viewOptions.minZoom !== viewOptions.minZoom)
    ) {
      // Re-create a view, ol doesn't provide any method to setExtent of view.
      this.map.setView(
        new View({
          ...viewOptions,
          ...{ center },
          ...{ resolution },
          ...{ extent: viewOptions.extent },
          ...{ maxZoom: viewOptions.maxZoom },
          ...{ minZoom: viewOptions.minZoom },
        }),
      );
    }
  }

  componentWillUnmount() {
    const { onFeaturesHover } = this.props;
    unByKey(this.moveEndRef);
    unByKey(this.singleClickRef);

    if (onFeaturesHover) {
      unByKey(this.pointerMoveRef);
    }
  }

  setLayers(layers = []) {
    const layersToRemove = this.layers.filter(layer => !layers.includes(layer));
    for (let i = 0; i < layersToRemove.length; i += 1) {
      this.terminateLayer(layersToRemove[i]);
    }

    const layersToInit = layers.filter(layer => !this.layers.includes(layer));
    for (let i = 0; i < layersToInit.length; i += 1) {
      this.initLayer(layersToInit[i]);
    }
    this.layers = layers;
  }

  initLayer(layer) {
    layer.init(this.map);
    const layers = layer.getChildren() || [];
    for (let i = 0; i < layers.length; i += 1) {
      this.initLayer(layers[i]);
    }
  }

  terminateLayer(layer) {
    layer.terminate(this.map);
    const layers = layer.getChildren() || [];
    for (let i = 0; i < layers.length; i += 1) {
      this.terminateLayer(layers[i]);
    }
  }

  render() {
    const { className, tabIndex, ariaLabel } = this.props;
    return (
      <div
        className={className}
        ref={this.node}
        role="presentation"
        aria-label={ariaLabel}
        tabIndex={tabIndex}
      >
        <ResizeHandler
          maxHeightBrkpts={null}
          maxWidthBrkpts={null}
          observe={this.node && this.node.current}
          onResize={() => {
            this.map.updateSize();
          }}
        />
      </div>
    );
  }
}

BasicMap.propTypes = propTypes;
BasicMap.defaultProps = defaultProps;

export default BasicMap;
