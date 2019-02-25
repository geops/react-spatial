/**
 * A class representing layer group with a name, a visibility, a radioGroup,
 * and a list of [ol/layer/Layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)
 */
export default class LayerGroup {
  constructor({ name, layers, radioGroup, isBaseLayer, visible }) {
    this.name = name;
    this.childs = layers;
    this.isBaseLayer = isBaseLayer;
    this.radioGroup = radioGroup;
    this.visible = typeof visible === 'undefined' ? true : visible;
    this.setVisible(this.visible);
  }

  getName() {
    return this.name;
  }

  getChilds() {
    return this.childs;
  }

  setChilds(layers) {
    this.childs = layers;
  }

  getVisibleChilds() {
    for (let i = 0; i < this.childs.length; i += 1) {
      if (this.childs[i].getVisible()) {
        return true;
      }
    }
    return false;
  }

  addChild(layer) {
    this.childs.unshift(layer);
  }

  removeChild(name) {
    for (let i = 0; i < this.childs.length; i += 1) {
      if (this.childs[i].getName() === name) {
        this.childs.splice(i, 1);
        return;
      }
    }
  }

  getIsBaseLayer() {
    return this.isBaseLayer;
  }

  getRadioGroup() {
    return this.radioGroup;
  }

  setVisible(visible) {
    this.visible = visible;
  }

  hasVisibleChilds() {
    return !!this.childs.find(l => l.getVisible());
  }
}
