import Observable from 'ol/Observable';
/**
 * A class representing layer to display on BasicMap with a name, a visibility,
 * a radioGroup, astatus and
 * an [ol/layer/Layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)
 */
export default class Layer extends Observable {
  constructor({ id, name, olLayer, radioGroup, isBaseLayer, visible }) {
    super();
    this.id = id;
    this.name = name;
    this.olLayer = olLayer;
    this.isBaseLayer = isBaseLayer;
    this.radioGroup = radioGroup;
    this.children = [];

    if (visible === undefined) {
      this.olLayer.setVisible(true);
    } else {
      this.olLayer.setVisible(visible);
    }
  }

  init(map) {
    this.map = map;
    map.addLayer(this.olLayer);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getVisible() {
    return this.olLayer.getVisible();
  }

  getIsBaseLayer() {
    return this.isBaseLayer;
  }

  getRadioGroup() {
    return this.radioGroup;
  }

  setRadioGroup(radioGroup) {
    this.radioGroup = radioGroup;
  }

  changed() {
    this.olLayer.changed();
  }

  setStyle(style) {
    this.olLayer.setStyle(style);
  }

  setVisible(
    visible,
    stopPropagationDown = false,
    stopPropagationUp = false,
    stopPropagationSiblings = false,
  ) {
    if (visible === this.olLayer.getVisible()) {
      return;
    }
    this.olLayer.setVisible(visible);
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
    return this.olLayer.getProperties();
  }

  setProperties(p) {
    this.olLayer.setProperties(p);
  }

  getParentId() {
    return this.olLayer.getProperties().parentId;
  }

  getRevision() {
    return this.olLayer.getRevision();
  }
}
