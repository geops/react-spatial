import Observable from 'ol/Observable';
/**
 * A class representing layer to display on BasicMap with a name, a visibility,
 * a radioGroup, astatus and
 * an [ol/layer/Layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)
 */
export default class Layer extends Observable {
  constructor({
    id,
    name,
    olLayer,
    radioGroup,
    isBaseLayer,
    visible,
    copyright,
  }) {
    super();
    this.id = id;
    this.name = name;
    this.olLayer = olLayer;
    this.isBaseLayer = isBaseLayer;
    this.radioGroup = radioGroup;
    this.children = [];
    this.visible = typeof visible === 'undefined' ? true : visible;
    this.copyright = copyright;

    if (this.olLayer) {
      this.olLayer.setVisible(this.visible);
    }
  }

  init(map) {
    this.map = map;
    if (this.map && this.olLayer) {
      map.addLayer(this.olLayer);
    }
  }

  getCopyright() {
    return this.copyright;
  }

  getName() {
    return this.name;
  }

  getVisible() {
    return this.visible;
  }

  getIsBaseLayer() {
    return this.isBaseLayer;
  }

  getRadioGroup() {
    if (!this.radioGroup && this.isBaseLayer) {
      return 'baseLayer';
    }
    return this.radioGroup;
  }

  setRadioGroup(radioGroup) {
    this.radioGroup = radioGroup;
  }

  changed() {
    if (this.olLayer) {
      this.olLayer.changed();
    }
  }

  setStyle(style) {
    if (this.olLayer) {
      this.olLayer.setStyle(style);
    }
  }

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

  getChildren() {
    return this.children;
  }

  setChildren(layers) {
    this.children = layers;
  }

  getVisibleChildren() {
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getVisible()) {
        return true;
      }
    }
    return false;
  }

  addChild(layer) {
    this.children.unshift(layer);
  }

  removeChild(name) {
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getName() === name) {
        this.children.splice(i, 1);
        return;
      }
    }
  }

  hasVisibleChildren() {
    return !!this.children.find(l => l.getVisible());
  }

  hasChildren(visible) {
    return !!this.children.find(l => visible === l.getVisible());
  }

  getProperties() {
    if (this.olLayer) {
      return this.olLayer.getProperties();
    }

    return null;
  }
}
