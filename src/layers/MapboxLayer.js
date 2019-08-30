/* eslint-disable no-underscore-dangle */
import { toLonLat } from 'ol/proj';
import mapboxgl from 'mapbox-gl';
import OLLayer from 'ol/layer/Layer';
import Layer from './Layer';

/**
 * A class representing Mapboxlayer to display on BasicMap
 * @class
 * @inheritDoc
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

    this.onRemove = evt => {
      if (evt.element === this.olLayer) {
        this.terminate();
      }
    };
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

    this.map.getLayers().on('remove', this.onRemove);

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
    });
  }

  /**
   * Terminate what was initialized in init function. Remove layer, events...
   */
  terminate() {
    super.terminate();
    if (this.mbMap) {
      this.mbMap.remove();
    }
    if (this.map) {
      this.map.getLayers().un('remove', this.onRemove);
    }
  }

  clone() {
    return new MapboxLayer(this.options);
  }
}
