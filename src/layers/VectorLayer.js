import Layer from '../Layer';

/**
 * A class representing vector layer to display on BasicMap
 * @class
 * @inheritDoc
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
   *   the layer instance and the click event.
   */
  onClick(callback) {
    if (typeof callback === 'function') {
      this.clickCallbacks.push(callback);
    } else {
      throw new Error('callback must be of type function.');
    }
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @param {ol.map} map ol.map (https://openlayers.org/en/latest/apidoc/module-ol_Map.html)
   */
  init(map) {
    super.init(map);
    this.map = map;

    // Listen to click events
    this.map.on('singleclick', e => {
      if (!this.clickCallbacks.length) {
        return;
      }

      const clickedFeatures = [];
      const layerFeatures = this.olLayer.getSource().getFeatures();

      this.map.forEachFeatureAtPixel(e.pixel, f => {
        if (layerFeatures.includes(f)) {
          clickedFeatures.push(f);
        }
      });

      this.clickCallbacks.forEach(c => c(clickedFeatures, this, e));
    });
  }
}

export default VectorLayer;
