/* eslint-disable no-underscore-dangle */
import { toLonLat } from 'ol/proj';
import { unByKey } from 'ol/Observable';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-unminified';
import OLLayer from 'ol/layer/Layer';
import GeoJSON from 'ol/format/GeoJSON';
import Layer from './Layer';

/**
 * A class representing Mapboxlayer to display on BasicMap
 * @class
 * @inheritDoc
 * @param {Object} [options]
 */
export default class MapboxLayer extends Layer {
  constructor(options = {}) {
    const mbLayer = new OLLayer({
      render: frameState => {
        const canvas = this.mbMap.getCanvas();

        const visible = mbLayer.getVisible();
        canvas.style.display = visible ? 'block' : 'none';

        const opacity = mbLayer.getOpacity();
        canvas.style.opacity = opacity;

        return canvas;
      },
      zIndex: options.zIndex,
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

    if (!this.map || !this.map.getTargetElement() || this.mbMap) {
      return;
    }

    this.format = new GeoJSON({
      featureProjection: this.map.getView().getProjection(),
    });

    // If the map hasn't been resized, the center could be [NaN,NaN].
    // We set default good value for the mapbox map, to avoid the app crashes.
    let [x, y] = map.getView().getCenter();
    if (!x || !y) {
      x = 0;
      y = 0;
    }

    this.mbMap = new mapboxgl.Map({
      style: this.styleUrl,
      attributionControl: false,
      boxZoom: false,
      center: toLonLat([x, y]),
      container: this.map.getTargetElement(),
      doubleClickZoom: false,
      dragPan: false,
      dragRotate: false,
      interactive: false,
      keyboard: false,
      pitchWithRotate: false,
      scrollZoom: false,
      touchZoomRotate: false,
      // Needs to be true to able to export the canvas, but could lead to performance issue on mobile.
      preserveDrawingBuffer: this.options.preserveDrawingBuffer || false,
    });
    const that = this;
    this.map.on('postrender', () => {
      // adjust view parameters in mapbox
      const view = that.map.getView();
      if (that.mbMap) {
        that.mbMap.jumpTo({
          center: toLonLat(view.getCenter()),
          zoom: view.getZoom() - 1,
        });
      }
    });

    this.mbMap.once('load', () => {
      this.loaded = true;
      this.dispatchEvent({
        type: 'load',
        target: this,
      });
    });

    this.changeSizeRef = this.map.on('change:size', () => {
      try {
        this.mbMap.resize();
      } catch (err) {
        // ignore render errors
        // eslint-disable-next-line no-console
        console.warn(err);
      }
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
      .map(feature => this.format.readFeature(feature));

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
    if (this.changeSizeRef) {
      unByKey(this.changeSizeRef);
    }
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
