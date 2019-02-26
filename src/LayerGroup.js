import OLGroup from 'ol/layer/Group';
import Layer from './Layer';

/**
 * A class representing layer group with a name, a visibility, a radioGroup,
 * and a list of [ol/layer/Layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)
 */
export default class LayerGroup extends Layer {
  constructor({ name, layers, olLayer, radioGroup, isBaseLayer }) {
    super({ name, olLayer, radioGroup, isBaseLayer });
    this.children = layers;
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
}
