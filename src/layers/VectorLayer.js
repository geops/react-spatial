import { buffer } from 'ol/extent';
import Layer from '../Layer';

/**
 * A class representing vector layer to display on BasicMap
 * @class
 */
class VectorLayer extends Layer {
  constructor(options = {}) {
    super(options);

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
    const res = this.map.getView().getResolution();
    const extent = buffer([...coordinate, ...coordinate], 5 * res);
    const features = this.olLayer.getSource().getFeaturesInExtent(extent);

    return Promise.resolve({
      features,
      layer: this,
      coordinate,
    });
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @inheritDoc
   */
  init(map) {
    super.init(map);
    this.map = map;

    // Listen to click events
    this.map.on('singleclick', e => {
      if (!this.clickCallbacks.length) {
        return;
      }

      this.getFeatureInfoAtCoordinate(e.coordinate)
        .then(features => {
          this.clickCallbacks.forEach(c => c(features, this, e));
        })
        .catch(() => {
          this.clickCallbacks.forEach(c => c([], this, e));
        });
    });
  }
}

export default VectorLayer;
