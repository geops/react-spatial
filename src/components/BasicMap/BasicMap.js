import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  defaults as defaultInteractions,
  DragRotate,
  PinchRotate,
} from 'ol/interaction';

import OLMap from 'ol/Map';
import OLCollection from 'ol/Collection';
import View from 'ol/View';
import { unByKey } from 'ol/Observable';
import Interaction from 'ol/interaction/Interaction';
import Layer from '../../Layer';
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
   */
  onFeaturesClick: PropTypes.func,

  /**
   * Callback when a [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html) is hovered.
   * @param {OLFeature[]} features An array of [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html).
   */
  onFeaturesHover: PropTypes.func,

  /**
   * Callback when the map was moved.
   * @param {ol.MapEvent} [evt](https://openlayers.org/en/latest/apidoc/module-ol_MapEvent-MapEvent.html).
   */
  onMapMoved: PropTypes.func,

  /** Map resolution */
  resolution: PropTypes.number,

  /** The tabIndex of the map. */
  tabIndex: PropTypes.number,

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
  className: 'tm-map',
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
      layers,
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
    const view = new View({ ...viewOptions, ...{ center } });

    this.map.setView(view);

    if (zoom || zoom === 0) {
      view.setZoom(zoom);
    }
    if (resolution) {
      view.setResolution(resolution);
    }
    window.map = this.map;

    this.node = React.createRef();

    if (layers.length) {
      this.setLayers(layers);
    }

    if (extent) {
      this.map.getView().fit(extent);
    }

    this.moveEndRef = this.map.on('moveend', e => onMapMoved(e));
    this.singleClickRef = null;
    this.pointerMoveRef = null;
  }

  componentDidMount() {
    const { onFeaturesClick, onFeaturesHover } = this.props;
    this.map.setTarget(this.node.current);

    this.singleClickRef = this.map.on('singleclick', evt => {
      const features = evt.map.getFeaturesAtPixel(evt.pixel);
      onFeaturesClick(features || []);
    });

    if (onFeaturesHover) {
      this.pointerMoveRef = this.map.on('pointermove', evt => {
        const features = this.map.getFeaturesAtPixel(evt.pixel);
        onFeaturesHover(features || []);
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

    if (viewOptions && prevProps.viewOptions.extent !== viewOptions.extent) {
      // Re-create a view, ol doesn't provide any method to setExtent of view.
      this.map.setView(
        new View({
          ...viewOptions,
          ...{ center },
          ...{ resolution },
          ...{ extent: viewOptions.extent },
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

  setLayers(layers) {
    this.map.getLayers().clear();
    for (let i = 0; i < layers.length; i += 1) {
      layers[i].init(this.map);
    }
  }

  render() {
    const { className, tabIndex } = this.props;
    return (
      <div
        className={className}
        ref={this.node}
        role="menu"
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
