import { equals } from "ol/extent";
import { defaults as defaultInteractions } from "ol/interaction";
import OLMap from "ol/Map";
import { unByKey } from "ol/Observable";
import View from "ol/View";
import { PureComponent } from "react";

import type OLCollection from "ol/Collection";
import type Interaction from "ol/interaction/Interaction";
import type Layer from "ol/layer/Layer";
import type React from "react";

export interface BasicMapProps {
  /** Map animation options */
  animationOptions?: {
    center?: number[];
    resolution?: number;
    zoom?: number;
  };
  /** HTML aria-label. */
  ariaLabel?: string;
  /** Center of the [ol/View](https://openlayers.org/en/latest/apidoc/module-ol_View-View.html). */
  center?: number[];
  /** Class name of the map container */
  className?: string;
  /** Map extent */
  extent?: number[];
  /**
   * Optional options to pass on feature click. Passed to ol's 'getFeaturesAtPixel' method.
   * https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html#getFeaturesAtPixel
   */
  featuresClickOptions?: {
    checkWrapped?: boolean;
    hitTolerance?: number;
    layerFilter?: (...args: any[]) => any;
  };
  /** Openlayers [fit options](https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit) when extent is updated */
  fitOptions?: Record<string, any>;
  /** Array of [ol/interaction](https://openlayers.org/en/latest/apidoc/module-ol_interaction_Interaction-Interaction.html). */
  interactions?: Interaction[] | OLCollection<Interaction>;
  /** Array of Openlayers layers */
  layers?: Layer[];
  /** An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html). */
  map?: OLMap;
  /**
   * Callback when a [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html) is clicked.
   * @param {OLFeature[]} features An array of [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html).
   * @param {ol.MapBrowserEvent} event The singleclick [ol/MapBrowserEvent](https://openlayers.org/en/latest/apidoc/module-ol_MapBrowserEvent-MapBrowserEvent.html#event:singleclick).
   */
  onFeaturesClick?: (features: any[], evt: any) => void;
  /**
   * Callback when a [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html) is hovered.
   * @param {OLFeature[]} features An array of [ol/Feature](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html).
   * @param {ol.MapBrowserEvent} event The pointermove [ol/MapBrowserEvent](https://openlayers.org/en/latest/apidoc/module-ol_MapBrowserEvent-MapBrowserEvent.html#event:pointermove).
   */
  onFeaturesHover?: (features: any[], evt: any) => void;
  /**
   * Callback when the map was moved.
   * @param {ol.MapEvent} event The movend [ol/MapEvent](https://openlayers.org/en/latest/apidoc/module-ol_MapBrowserEvent-MapBrowserEvent.html#event:moveend).
   */
  onMapMoved?: (evt: any) => void;
  /** Map resolution */
  resolution?: number;
  /** The style of the map. */
  style?: React.CSSProperties;
  /** The tabIndex of the map. */
  tabIndex?: number;
  /** [ol/View](https://openlayers.org/en/latest/apidoc/module-ol_View-View.html) constructor options */
  viewOptions?: {
    extent?: number[];
    maxZoom?: number;
    minZoom?: number;
    projection?: string;
  };
  /** Map zoom level */
  zoom?: number;
}

interface BasicMapState {
  node: HTMLDivElement | null;
}

const defaultProps: Partial<BasicMapProps> = {
  animationOptions: undefined,
  ariaLabel: "map",
  center: [0, 0],
  className: "rs-map",
  extent: undefined,
  featuresClickOptions: {
    hitTolerance: 0,
  },
  fitOptions: {
    duration: 1000,
    maxZoom: 23,
    padding: [20, 20, 20, 20],
  },
  interactions: null,
  layers: [],
  map: null,
  onFeaturesClick: undefined,
  onFeaturesHover: undefined,
  onMapMoved: undefined,
  resolution: undefined,
  style: undefined,
  tabIndex: undefined,
  viewOptions: {
    extent: undefined,
    maxZoom: 22,
    minZoom: 0,
    projection: "EPSG:3857",
  },
  zoom: 1,
};

/**
 * The BasicMap component renders an [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
 *
 * The map's view is created with the following parameters for the view:
 *  - projection: 'EPSG:3857'
 *  - zoom: 0
 *  - minZoom: 0
 *  - maxZoom: 22
 *
 * These options can be overridden using the viewOptions property.
 */
class BasicMap extends PureComponent<BasicMapProps, BasicMapState> {
  map: OLMap;
  moveEndRef: any;
  pointerMoveRef: any;
  singleClickRef: any;

  constructor(props: BasicMapProps) {
    super(props);
    const { interactions, map } = this.props;

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

    this.state = {
      node: null,
    };

    this.moveEndRef = null;
    this.singleClickRef = null;
    this.pointerMoveRef = null;
    this.setNode = this.setNode.bind(this);
  }

  componentDidMount() {
    const { center, extent, layers, resolution, viewOptions, zoom } =
      this.props;
    const { node } = this.state;
    this.map.setTarget(node);

    // We set the view here otherwise the map is not correctly zoomed.
    this.map.setView(new View({ ...viewOptions, center, resolution, zoom }));

    // // Since ol 6.1.0 touch-action is set to auto and creates a bad navigation experience on mobile,
    // // so we have to force it to none for mobile.
    // // https://github.com/openlayers/openlayers/pull/10187/files
    const viewPort = this.map.getViewport();
    viewPort.style.touchAction = "none";
    (viewPort.style as any).msTouchAction = "none";
    viewPort.setAttribute("touch-action", "none");

    // Fit only work if the map has a size.
    if (this.map.getSize() && extent) {
      this.map.getView().fit(extent);
    }

    this.setLayers(layers);
    this.listenMoveEnd();
    this.listenSingleClick();
    this.listenPointerMove();
  }

  componentDidUpdate(prevProps: BasicMapProps, prevState: BasicMapState) {
    const {
      animationOptions,
      center,
      extent,
      fitOptions,
      layers,
      onFeaturesClick,
      onFeaturesHover,
      onMapMoved,
      resolution,
      viewOptions,
      zoom,
    } = this.props;
    const { node } = this.state;

    if (prevState.node !== node) {
      if (zoom) {
        this.map.getView().setZoom(zoom);
      }

      if (resolution) {
        this.map.getView().setResolution(resolution);
      }
      this.map.setTarget(node);

      // When the node is set we reinitialize the extent with the extent property.
      if (!prevState.node && node && extent) {
        this.map.getView().fit(extent);
      }
    }

    if (prevProps.layers !== layers) {
      this.setLayers(layers, prevProps.layers);
    }

    // Creates a new view if necessary before updating the others prop.
    if (
      viewOptions &&
      JSON.stringify(viewOptions) !== JSON.stringify(prevProps.viewOptions)
    ) {
      // Re-create a view, ol doesn't provide any method to setExtent of view.
      this.map.setView(
        new View({
          ...viewOptions,
          center,
          resolution,
          zoom,
        }),
      );
    }

    const view = this.map.getView();

    if (animationOptions && prevProps.animationOptions !== animationOptions) {
      view.animate(animationOptions);
    }

    if (prevProps.center !== center) {
      view.setCenter(center);
    }

    if (zoom !== prevProps.zoom) {
      view.setZoom(zoom);
    }

    if (resolution !== prevProps.resolution) {
      view.setResolution(resolution);
    }

    if (extent && !equals(extent, prevProps.extent || [])) {
      view.fit(extent, fitOptions);
    }

    if (onMapMoved !== prevProps.onMapMoved) {
      this.listenMoveEnd();
    }

    if (onFeaturesClick !== prevProps.onFeaturesClick) {
      this.listenSingleClick();
    }

    if (onFeaturesHover !== prevProps.onFeaturesHover) {
      this.listenPointerMove();
    }
  }

  componentWillUnmount() {
    unByKey([this.moveEndRef, this.singleClickRef, this.pointerMoveRef]);
  }

  initLayer(layer: any) {
    if (!this.map?.getLayers()?.getArray()?.includes(layer)) {
      this.map.addLayer(layer);
    }

    const layers = layer.get("children") || layer.children || [];
    for (let i = 0; i < layers.length; i += 1) {
      this.initLayer(layers[i]);
    }
  }

  listenMoveEnd() {
    const { onMapMoved } = this.props;
    unByKey(this.moveEndRef);

    if (!onMapMoved) {
      return;
    }

    this.moveEndRef = this.map.on("moveend", (evt) => {
      return onMapMoved(evt);
    });
  }

  listenPointerMove() {
    const { onFeaturesHover } = this.props;
    unByKey(this.pointerMoveRef);

    if (!onFeaturesHover) {
      return;
    }

    this.pointerMoveRef = this.map.on("pointermove", (evt) => {
      const features = evt.map.getFeaturesAtPixel(evt.pixel);
      onFeaturesHover(features || [], evt);
    });
  }

  listenSingleClick() {
    const { featuresClickOptions, onFeaturesClick } = this.props;
    unByKey(this.singleClickRef);

    if (!onFeaturesClick) {
      return;
    }

    this.singleClickRef = this.map.on("singleclick", (evt) => {
      const features = evt.map.getFeaturesAtPixel(
        evt.pixel,
        featuresClickOptions,
      );
      onFeaturesClick(features || [], evt);
    });
  }

  render() {
    const { ariaLabel, className, style, tabIndex } = this.props;
    return (
      <div
        aria-label={ariaLabel}
        className={className}
        ref={this.setNode}
        role="presentation"
        style={style}
        tabIndex={tabIndex}
      />
    );
  }

  setLayers(layers: Layer[] = [], prevLayers: Layer[] = []) {
    for (let i = 0; i < prevLayers.length; i += 1) {
      this.terminateLayer(prevLayers[i]);
    }
    for (let i = 0; i < layers.length; i += 1) {
      this.initLayer(layers[i]);
    }
  }

  setNode(node: HTMLDivElement | null) {
    this.setState({ node });
  }

  terminateLayer(layer: any) {
    const layers = layer.get("children") || layer.children || [];
    for (let i = 0; i < layers.length; i += 1) {
      this.terminateLayer(layers[i]);
    }

    if (this.map?.getLayers()?.getArray()?.includes(layer)) {
      this.map.removeLayer(layer);
    }
  }
}

(BasicMap as any).defaultProps = defaultProps;

export default BasicMap;
