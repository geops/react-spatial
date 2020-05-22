/* eslint-disable no-underscore-dangle */
import { toLonLat } from 'ol/proj';
import mapboxgl from 'mapbox-gl';
import OLLayer from 'ol/layer/Layer';
import GeoJSON from 'ol/format/GeoJSON';
import Layer from './Layer';

const getCopyrightFromSources = (mbMap) => {
  let copyrights = [];
  const regex = /<[^>]*>[^>]*<\/[^>]*>/g;
  // Trick from Mapbox AttributionControl to know if the source is used.
  const { sourceCaches } = mbMap.style;
  Object.entries(sourceCaches).forEach(([, sourceCache]) => {
    if (sourceCache.used) {
      copyrights = copyrights.concat(
        regex.exec(sourceCache.getSource().attribution),
      );
    }
  });
  return Array.from(
    new Set(copyrights.filter((copyright) => !!copyright)),
  ).join(', ');
};

/**
 * A class representing Mapboxlayer to display on BasicMap
 * @class
 * @inheritDoc
 * @param {Object} [options]
 */
export default class MapboxLayer extends Layer {
  constructor(options = {}) {
    const mbLayer = new OLLayer({
      render: (frameState) => {
        if (!this.mbMap) {
          // eslint-disable-next-line no-console
          console.warn("Mapbox map doesn't exist.");
          return null;
        }
        let changed = false;
        const canvas = this.mbMap.getCanvas();
        const { viewState } = frameState;

        const visible = this.olLayer.getVisible();
        if (this.renderState.visible !== visible) {
          canvas.style.display = visible ? 'block' : 'none';
          this.renderState.visible = visible;
          // Needed since mapbox-gl 1.9.0.
          // Without you don't see others ol layers on top.
          canvas.style.position = 'absolute';
        }

        const opacity = this.olLayer.getOpacity();
        if (this.renderState.opacity !== opacity) {
          canvas.style.opacity = opacity;
          this.renderState.opacity = opacity;
        }

        // adjust view parameters in mapbox
        const { rotation } = viewState;
        if (rotation && this.renderState.rotation !== rotation) {
          this.mbMap.rotateTo((-rotation * 180) / Math.PI, {
            animate: false,
          });
          changed = true;
          this.renderState.rotation = rotation;
        }

        if (
          this.renderState.zoom !== viewState.zoom ||
          this.renderState.center[0] !== viewState.center[0] ||
          this.renderState.center[1] !== viewState.center[1]
        ) {
          this.mbMap.jumpTo({
            center: toLonLat(viewState.center),
            zoom: viewState.zoom - 1,
            animate: false,
          });
          changed = true;
          this.renderState.zoom = viewState.zoom;
          this.renderState.center = viewState.center;
        }

        const size = this.map.getSize();
        if (
          this.renderState.size[0] !== size[0] ||
          this.renderState.size[1] !== size[1]
        ) {
          changed = true;
          this.renderState.size = size;
        }

        // cancel the scheduled update & trigger synchronous redraw
        // see https://github.com/mapbox/mapbox-gl-js/issues/7893#issue-408992184
        // NOTE: THIS MIGHT BREAK WHEN UPDATING MAPBOX
        if (this.mbMap && this.mbMap.style && this.mbMap.isStyleLoaded()) {
          if (this.mbMap._frame) {
            this.mbMap._frame.cancel();
            this.mbMap._frame = null;
          }
          try {
            if (changed) {
              this.mbMap._render();
            }
          } catch (err) {
            // ignore render errors because it's probably related to
            // a render during an update of the style.
            // eslint-disable-next-line no-console
            console.warn(err);
          }
        }

        return canvas;
      },
    });

    super({
      ...options,
      olLayer: mbLayer,
    });
    this.options = options;
    this.styleUrl = options.url;
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @param {ol.map} map {@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html ol/Map}
   */
  init(map) {
    super.init(map);

    if (!this.map || this.mbMap) {
      return;
    }

    this.format = new GeoJSON({
      featureProjection: this.map.getView().getProjection(),
    });

    if (this.map.getTargetElement()) {
      this.loadMbMap();
    }

    this.olListenersKeys.push(
      this.map.on('change:target', () => {
        this.loadMbMap();
      }),
    );

    this.olListenersKeys.push(
      this.map.on('change:size', () => {
        try {
          if (this.mbMap) {
            this.mbMap.resize();
          }
        } catch (err) {
          // ignore render errors
          // eslint-disable-next-line no-console
          console.warn(err);
        }
      }),
    );
  }

  /**
   * Create the mapbox map.
   */
  loadMbMap() {
    // If the map hasn't been resized, the center could be [NaN,NaN].
    // We set default good value for the mapbox map, to avoid the app crashes.
    let [x, y] = this.map.getView().getCenter();
    if (!x || !y) {
      x = 0;
      y = 0;
    }

    try {
      this.mbMap = new mapboxgl.Map({
        style: this.styleUrl,
        attributionControl: false,
        boxZoom: false,
        center: toLonLat([x, y]),
        container: this.map.getTargetElement(),
        interactive: false,
        fadeDuration:
          'fadeDuration' in this.options ? this.options.fadeDuration : 300,
        // Needs to be true to able to export the canvas, but could lead to performance issue on mobile.
        preserveDrawingBuffer: this.options.preserveDrawingBuffer || false,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed creating mapbox map: ', err);
    }

    // Options the last render run did happen. If something changes
    // we have to render again
    this.renderState = {
      center: [x, y],
      zoom: null,
      rotation: null,
      visible: null,
      opacity: null,
      size: [0, 0],
    };

    this.mbMap.once('load', () => {
      this.loaded = true;
      if (!this.getCopyright()) {
        this.setCopyright(getCopyrightFromSources(this.mbMap));
      }
      this.dispatchEvent({
        type: 'load',
        target: this,
      });
    });

    const mapboxCanvas = this.mbMap.getCanvas();
    if (mapboxCanvas) {
      // Set default tabIndex to -1, so we can't access the canvas via Tab nav.
      mapboxCanvas.setAttribute('tabindex', this.options.tabIndex || -1);
    }
  }

  /**
   * Request feature information for a given coordinate.
   * @param {ol.Coordinate} coordinate Coordinate to request the information at.
   * @param {Object} options A mapbox {@link https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html options object}.
   * @returns {Promise<Object>} Promise with features, layer and coordinate
   *  or null if no feature was hit.
   */
  getFeatureInfoAtCoordinate(coordinate, options) {
    // Ignore the getFeatureInfo until the mapbox map is loaded
    if (
      !options ||
      !this.format ||
      !this.mbMap ||
      !this.mbMap.isStyleLoaded()
    ) {
      return Promise.resolve({ coordinate, features: [], layer: this });
    }

    const pixel = coordinate && this.mbMap.project(toLonLat(coordinate));
    // At this point we get GeoJSON Mapbox feature, we transform it to an Openlayers
    // feature to be consistent with other layers.
    const features = this.mbMap
      .queryRenderedFeatures(pixel, options)
      .map((feature) => this.format.readFeature(feature));

    return Promise.resolve({
      layer: this,
      features,
      coordinate,
    });
  }

  /**
   * Terminate what was initialized in init function. Remove layer, events...
   */
  terminate() {
    if (this.mbMap) {
      // Some asynchrone repaints are triggered even if the mbMap has been removed,
      // to avoid display of errors we set an empty function.
      this.mbMap.triggerRepaint = () => {};
      this.mbMap.remove();
      this.mbMap = null;
    }
    this.loaded = false;
    super.terminate();
  }

  /**
   * Create exact copy of the MapboxLayer
   * @returns {MapboxLayer} MapboxLayer
   */
  clone() {
    return new MapboxLayer({ ...this.options, url: this.styleUrl });
  }
}
