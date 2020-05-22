import Observable, { unByKey } from 'ol/Observable';

/**
 * A class representing a layer to display on BasicMap with a name and
 * an {@link https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html ol/Layer} and further options
 * @class
 * @param {Object} options
 * @param {string} options.name Layer name (required).
 * @param {ol.layer} options.olLayer The {@link https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html ol/Layer} (required).
 * @param {string} [options.key=undefined] Layer key, will use options.name.toLowerCase() if not specified.
 * @param {boolean} [options.isBaseLayer=undefined] If true this layer is a baseLayer.
 * @param {Array<ol.layer>} [options.children=[]] Sublayers.
 * @param {boolean} [options.visible=true] If true this layer is the currently visible layer on the map.
 * @param {string} [options.copyright=undefined] Copyright-Statement.
 * @param {Object} [options.properties={}] Application-specific layer properties.
 * @param {boolean} [options.isQueryable=undefined] If true feature information can be queried by the react-spatial LayerService. Default is undefined, but resulting to true if not strictly set to false.
 */

export default class Layer extends Observable {
  constructor({
    name,
    olLayer,
    key,
    isBaseLayer,
    children,
    visible,
    copyright,
    properties,
    isQueryable,
  }) {
    super();
    this.name = name;
    this.olLayer = olLayer;
    this.key = key || name.toLowerCase();
    this.isBaseLayer = isBaseLayer;
    this.children = children || [];
    this.visible = visible === undefined ? true : visible;
    this.copyright = copyright;
    this.properties = properties || {};
    this.isQueryable = isQueryable !== false;

    // Custom property for duck typing since `instanceof` is not working
    // when the instance was created on different bundles.
    this.isReactSpatialLayer = true;

    // This array contains openlayers listeners keys to unlisten in terminate function.
    this.olListenersKeys = [];

    if (this.olLayer) {
      this.olLayer.setVisible(this.visible);
    }
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @param {ol.map} map {@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html ol/Map}
   */
  init(map) {
    this.terminate();
    this.map = map;
    if (!this.map || !this.olLayer) {
      return;
    }
    this.map.addLayer(this.olLayer);

    this.olListenersKeys.push(
      this.map.getLayers().on('remove', (evt) => {
        if (evt.element === this.olLayer) {
          this.terminate();
        }
      }),
    );
  }

  /**
   * Terminate what was initialized in init function. Remove layer, events...
   */
  terminate() {
    unByKey(this.olListenersKeys);
    if (this.map && this.olLayer) {
      this.map.removeLayer(this.olLayer);
    }
  }

  /**
   * Get a layer property.
   * @param {string} name Property name.
   * @returns {property} Property
   */
  get(name) {
    return this.properties[name];
  }

  /**
   * Set a layer property.
   * @param {string} name Property name.
   * @param {string} value Value.
   */
  set(name, value) {
    this.properties[name] = value;
    this.dispatchEvent({
      type: `change:${name}`,
      target: this,
    });
  }

  /**
   * Get the Layer's Copyright Statment.
   * @returns {string} Copyright
   */
  getCopyright() {
    return this.copyright;
  }

  /**
   * Get the Layername.
   * @returns {string} Layername
   */
  getName() {
    return this.name;
  }

  /**
   * Get the Layers Key.
   * @returns {string} Key
   */
  getKey() {
    return this.key;
  }

  /**
   * Return whether the layer is visible or not.
   * @returns {boolean} If true, the layer is visible.
   */
  getVisible() {
    return this.visible;
  }

  /**
   * Returns whether the layer is the BaseLayer or not.
   * @returns {boolean} If true, the layer is the BaseLayer.
   */
  getIsBaseLayer() {
    return this.isBaseLayer;
  }

  /**
   * Get the Layer's Copyright Statment.
   * @returns {string} Copyright
   */
  setCopyright(copyright) {
    this.copyright = copyright;
    this.dispatchEvent({
      type: 'change:copyright',
    });
  }

  /**
   * Change the visibility of the layer
   * @param {boolean} visible Defines the visibility of the layer
   * @param {boolean} [stopPropagationDown]
   * @param {boolean} [stopPropagationUp]
   * @param {boolean} [stopPropagationSiblings]
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
   * Returns an array with childlayers
   *
   * @returns {Array<ol.layer>} Children
   */
  getChildren() {
    return this.children;
  }

  /**
   * Sets the child layers
   *
   * @param {Array<ol.layer>} layers
   */
  setChildren(layers) {
    this.children = layers;
  }

  /**
   * Returns an array with visible child layers
   *
   * @returns {Array<ol.layer>} Visible children
   */
  getVisibleChildren() {
    return this.children.filter((c) => c.getVisible() === true);
  }

  /**
   * Add a child layer
   *
   * @param {ol.layer} layer Child layer
   */
  addChild(layer) {
    this.children.unshift(layer);
  }

  /**
   * Removes a child layer by layer name
   *
   * @param {string} name Layer name
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
   * Checks whether the layer has child layers with visible set to True
   *
   * @returns {boolean} True if the layer has visible child layers
   */
  hasVisibleChildren() {
    return !!this.children.find((l) => l.getVisible());
  }

  /**
   * Checks whether the layer has any child layers with visible equal to the input parameter
   * @param {boolean} visible The state to check the childlayers against
   * @returns {boolean} True if the layer has children with the given visibility
   */
  hasChildren(visible) {
    return !!this.children.find((l) => visible === l.getVisible());
  }

  // eslint-disable-next-line class-methods-use-this
  onClick() {
    // This layer has no onClick.
    // The function is implemented by inheriting layers.
  }

  /**
   * Request feature information for a given coordinate.
   * @param {ol.Coordinate} coordinate Coordinate to request the information at.
   * @returns {Promise<Object>} Promise with features, layer and coordinate
   *  or null if no feature was hit.
   */
  getFeatureInfoAtCoordinate() {
    // This layer returns no feature info.
    // The function is implemented by inheriting layers.
    return Promise.resolve({
      layer: this,
      features: [],
      coordinate: null,
    });
  }
}
