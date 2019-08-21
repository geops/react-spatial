/* eslint-disable no-underscore-dangle */
import { toLonLat } from 'ol/proj';
import mapboxgl from 'mapbox-gl';
import OLLayer from 'ol/layer/Layer';
import Layer from '../Layer';

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
    this.styleUrl = options.url;
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @param {ol.map} map ol.map (https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)
   */
  init(map) {
    super.init(map);
    this.map = map;
    this.mbMap = new mapboxgl.Map({
      style: this.styleUrl,
      attributionControl: false,
      boxZoom: false,
      center: toLonLat(map.getView().getCenter()),
      container: map.getTargetElement(),
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
}
