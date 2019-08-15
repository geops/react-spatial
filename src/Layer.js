import Observable from 'ol/Observable';

/**
 * A class representing layer to display on BasicMap with a name, a visibility,
 * a radioGroup, astatus and
 * an ol.layer(https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)
 * @class
 * @param {Object} options
 * @param {string} options.key information about the key
 * @param {string} options.name The name of the new layer
 * @param {ol.layer} options.olLayer the ol.Layer
 * @param {radioGroup} options.radioGroup radioGroup
 * @param {boolean} options.isBaseLayer if true this layer is the baseLayer
 * @param {boolean} options.hideInLegend If true hidden legend
 * @param {boolean} options.visible If true layer is visible
 * @param {string} options.copyright Copyright-Statement
 */

export default class Layer extends Observable {
  constructor({
    key,
    name,
    olLayer,
    radioGroup,
    isBaseLayer,
    hideInLegend,
    visible,
    copyright,
  }) {
    super();
    this.key = key || name.toLowerCase();
    this.name = name;
    this.olLayer = olLayer;
    this.isBaseLayer = isBaseLayer;
    this.hideInLegend = hideInLegend;
    this.radioGroup = radioGroup;
    this.children = [];
    this.visible = visible === undefined ? true : visible;
    this.copyright = copyright;

    if (this.olLayer) {
      this.olLayer.setVisible(this.visible);
    }
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @param {ol.map} map ol.map (https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)
   */

  init(map) {
    this.map = map;
    if (this.map && this.olLayer) {
      map.addLayer(this.olLayer);
    }
  }

  /**
   * Get the Layer's Copyright Statment.
   * @returns {string}
   */

  getCopyright() {
    return this.copyright;
  }

  /**
   * Get the Layername.
   * @returns {string}
   */

  getName() {
    return this.name;
  }

  /**
   * Get the Layers Key.
   * @returns {string}
   */

  getKey() {
    return this.key;
  }

  /**
   * Return whether the layer is visible or not.
   * @returns {boolean}
   */

  getVisible() {
    return this.visible;
  }

  /**
   * Returns whether the layer is the BaseLayer or not.
   * @returns {boolean}
   */

  getIsBaseLayer() {
    return this.isBaseLayer;
  }

  /**
   * Returns whether the legend is hidden or not.
   * @returns {boolean}
   */

  getHideInLegend() {
    return this.hideInLegend;
  }

  /**
   * Get the layers radioGroup
   * @returns {string}
   */

  getRadioGroup() {
    if (!this.radioGroup && this.isBaseLayer) {
      return 'baseLayer';
    }
    return this.radioGroup;
  }

  setRadioGroup(radioGroup) {
    this.radioGroup = radioGroup;
  }

  /**
   * Change the visibility of the layer
   * @param {boolean} visible defines the visibility of the layer
   * @param {boolean} stopPropagationDown
   * @param {boolean} stopPropagationUp
   * @param {boolean} stopPropagationSiblings
   */

  setVisible(
    visible,
    stopPropagationDown = false,
    stopPropagationUp = false,
    stopPropagationSiblings = false,
  ) {
    if (visible === this.visible) {
      return;
    }

    this.visible = visible;

    if (this.olLayer) {
      this.olLayer.setVisible(this.visible);
    }

    this.dispatchEvent({
      type: 'change:visible',
      target: this,
      stopPropagationDown,
      stopPropagationUp,
      stopPropagationSiblings,
    });
  }

  /**
   * returns an array with childlayers
   *
   * @returns {Array<ol.layer>}
   */

  getChildren() {
    return this.children;
  }

  /**
   * sets the child layers
   *
   * @param {Array<ol.layer>} layers
   */

  setChildren(layers) {
    this.children = layers;
  }

  /**
   * returns an array with visible child layers
   *
   * @returns {Array<ol.layer>}
   */

  getVisibleChildren() {
    return this.children.filter(c => c.getVisible() === true);
  }

  /**
   * add a child layer
   *
   * @param {ol.layer} layer
   */

  addChild(layer) {
    this.children.unshift(layer);
  }

  /**
   * removes a child layer by layer name
   *
   * @param {string} name
   */

  removeChild(name) {
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getName() === name) {
        this.children.splice(i, 1);
        return;
      }
    }
  }

  /**
   * checks whether the layer has child layers with visible set to True
   *
   * @returns {boolean}
   */

  hasVisibleChildren() {
    return !!this.children.find(l => l.getVisible());
  }

  /**
   * checks whether the layer has any child layers with visible equal to the input parameter
   * @param {boolean} visible The state to check the childlayers against
   * @returns {boolean}
   */

  hasChildren(visible) {
    return !!this.children.find(l => visible === l.getVisible());
  }
}
