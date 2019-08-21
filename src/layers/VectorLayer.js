import { unByKey } from 'ol/Observable';
import Layer from './Layer';

/**
 * A class representing vector layer to display on BasicMap
 * @class
 * @inheritDoc
 */
class VectorLayer extends Layer {
  constructor(options = {}) {
    super(options);

    this.hitTolerance = options.hitTolerance || 5;

    // Array of click callbacks
    this.clickCallbacks = [];

    // Add click callback
    if (options.onClick) {
      this.onClick(options.onClick);
    }
  }

  /**
   * Listens to click events on the layer.
   * @param {function} callback Callback function, called with the clicked
   *   features (https://openlayers.org/en/latest/apidoc/module-ol_Feature.html),
   *   the layer instance and the click coordinate.
   */
  onClick(callback) {
    if (typeof callback === 'function') {
      this.clickCallbacks.push(callback);
    } else {
      throw new Error('callback must be of type function.');
    }
  }

  /**
   * Request feature information for a given coordinate.
   * @param {ol.Coordinate} coordinate Coordinate to request the information at.
   * @returns {Promise<Object>} Promise with features, layer and coordinate
   *  or null if no feature was hit.
   * eslint-disable-next-line class-methods-use-this
   */
  getFeatureInfoAtCoordinate(coordinate) {
    const pixel = this.map.getPixelFromCoordinate(coordinate);
    const features = this.map.getFeaturesAtPixel(
      pixel,
      l => l === this.olLayer,
      this.hitTolerance,
    );

    return Promise.resolve({
      features,
      layer: this,
      coordinate,
    });
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @param {ol.map} map ol.map (https://openlayers.org/en/latest/apidoc/module-ol_Map.html)
   */
  init(map) {
    super.init(map);

    if (!this.map) {
      return;
    }

    // Listen to click events
    this.singleClickRef = this.map.on('singleclick', e => {
      if (!this.clickCallbacks.length) {
        return;
      }

      this.getFeatureInfoAtCoordinate(e.coordinate)
        .then(data => {
          this.clickCallbacks.forEach(c =>
            c(data.features, data.layer, data.coordinate),
          );
        })
        .catch(() => {
          this.clickCallbacks.forEach(c => c([], this, e.coordinate));
        });
    });
  }

  /**
   * Terminate what was initialized in init function. Remove layer, events...
   */
  terminate() {
    super.terminate();
    if (this.singleClickRef) {
      unByKey(this.singleClickRef);
    }
  }
}

export default VectorLayer;
