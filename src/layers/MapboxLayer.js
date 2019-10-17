/* eslint-disable no-underscore-dangle */
import { toLonLat } from 'ol/proj';
import { unByKey } from 'ol/Observable';
import mapboxgl from 'mapbox-gl';
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
        const { viewState } = frameState;

        const visible = mbLayer.getVisible();
        canvas.style.display = visible ? 'block' : 'none';

        const opacity = mbLayer.getOpacity();
        canvas.style.opacity = opacity;

        // adjust view parameters in mapbox
        const { rotation } = viewState;
        if (rotation) {
          this.mbMap.rotateTo((-rotation * 180) / Math.PI, {
            animate: false,
          });
        }
        this.mbMap.jumpTo({
          center: toLonLat(viewState.center),
          zoom: viewState.zoom - 1,
          animate: false,
        });

        // cancel the scheduled update & trigger synchronous redraw
        // see https://github.com/mapbox/mapbox-gl-js/issues/7893#issue-408992184
        // NOTE: THIS MIGHT BREAK WHEN UPDATING MAPBOX
        if (this.mbMap._frame) {
          this.mbMap._frame.cancel();
          this.mbMap._frame = null;
        }
        this.mbMap._render();

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

    if (!this.map || !this.map.getTargetElement()) {
      return;
    }

    this.format = new GeoJSON({
      featureProjection: this.map.getView().getProjection(),
    });

    this.mbMap = new mapboxgl.Map({
      style: this.styleUrl,
      attributionControl: false,
      boxZoom: false,
      center: toLonLat(map.getView().getCenter()),
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

    this.changeSizeRef = this.map.on('change:size', () => {
      this.mbMap.resize();
    });
  }

  /**
   * Request feature information for a given coordinate.
   * @param {ol.Coordinate} coordinate Coordinate to request the information at.
   * @param {Object} options A mapbox {@link https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html options object}.
   * @returns {Promise<Object>} Promise with features, layer and coordinate
   *  or null if no feature was hit.
   */
  getFeatureInfoAtCoordinate(coordinate, options) {
    let features = [];
    if (this.mbMap && this.format && options) {
      const pixel = this.mbMap.project(toLonLat(coordinate));
      // At this point we get GosJSON Mapbox feature, we transform it to an Openlayers
      // feature to be consistent with other layers.
      features = this.mbMap
        .queryRenderedFeatures(pixel, options)
        .map(feature => this.format.readFeature(feature));
    }
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
    super.terminate();
    if (this.changeSizeRef) {
      unByKey(this.changeSizeRef);
    }
    if (this.mbMap) {
      this.mbMap.remove();
    }
  }

  /**
   * Create exact copy of the MapboxLayer
   * @returns {MapboxLayer}
   */
  clone() {
    return new MapboxLayer(this.options);
  }
}
