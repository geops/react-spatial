import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import Layer from './Layer';

export default class VectorLayer extends Layer {
  /**
   * Vector layer.
   * @param {string} name The layer's name
   * @param {Object} [options] Layer options
   * @param {Array.<ol.Feature>} [options.features] Layer features
   * @param {ol.style.Style} [options.style] Layer style
   */
  constructor(options) {
    const {
      style, features, source, declutter,
    } = options;
    const olLayer = new OLVectorLayer({
      declutter,
      style,
      source: source || new VectorSource({
        features: features || [],
      }),
    });

    super({ ...options, olLayer });

    /**
     * List of features.
     * @type {Array.<ol.Feature>}
     */
  }

  /**
   * Add features to the layer.
   * @p@param {Array.<ol.Feature>} features List of feature.
   */
  addFeatures(features) {
    this.olLayer.getSource().addFeatures(features);
  }

  getFeatures() {
    return this.olLayer.getSource().getFeatures();
  }

  clear() {
    this.olLayer.getSource().clear();
  }
}
