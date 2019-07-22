import Layer from '../Layer';

class VectorLayer extends Layer {
  constructor(options = {}) {
    super(options);

    // Object of callbacks
    this.callbacks = {};
  }

  /**
   * Listens to events.
   * @param {string} type Callback type. Allowed is 'click'.
   * @param {function} callback Callback function, called with the
   *   features (https://openlayers.org/en/latest/apidoc/module-ol_Feature.html),
   *   the layer instance and the event.
   */
  on(type, callback) {
    if (typeof callback === 'function') {
      this.callbacks[type] = this.callbacks[type] || [];
      this.callbacks[type].push(callback);
    } else {
      throw new Error('callback must be of type function.');
    }
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
      const clickedFeatures = [];
      const layerFeatures = this.olLayer.getSource().getFeatures();

      this.map.forEachFeatureAtPixel(e.pixel, f => {
        if (layerFeatures.includes(f)) {
          clickedFeatures.push(f);
        }
      });

      (this.callbacks.click || []).forEach(c => c(clickedFeatures, this, e));
    });
  }
}

export default VectorLayer;
