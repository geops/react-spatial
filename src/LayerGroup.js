import Observable from 'ol/Observable';

/**
 * A class representing layer group with a name, a visibility, a radioGroup,
 * and a list of [ol/layer/Layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)
 */
export default class LayerGroup {
  constructor({ name, layers, radioGroup, isBaseLayer, visible }) {
    this.name = name;
    this.children = layers;
    this.isBaseLayer = isBaseLayer;
    console.log(radioGroup);
    this.radioGroup = radioGroup;
    this.visible = typeof visible === 'undefined' ? true : visible;
    this.setVisible(this.visible);
    this.props = {};
    this.revision = 0;
    this.keys = [];

    this.listenChangeEvt();
  }

  listenChangeEvt() {
    const taht = this;
    this.children.forEach(layer => {
      this.keys.push(
        layer.olLayer.on('change:visible', (evt, val) => {
          console.log('changevisible', evt, val);
          taht.onChildrenChangeVisible();
        }),
      );
    });
  }

  unlistenChangeEvt() {
    this.keys.forEach(key => {
      Observable.unByKey(key);
    });
  }

  onChildrenChangeVisible() {
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getVisible()) {
        if (!this.getVisible()) {
          this.setVisible(true);
        }
        return;
      }
    }
    this.setVisible(false);
  }

  getName() {
    return this.name;
  }

  getChildren() {
    return this.children;
  }

  setChildren(layers) {
    this.children = layers;
    this.revision++;
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
    this.revision++;
  }

  removeChild(name) {
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getName() === name) {
        this.children.splice(i, 1);
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

  setRadioGroup(radioGroup) {
    this.radioGroup = radioGroup;
    this.revision++;
  }

  getVisible() {
    return this.visible;
  }

  setVisible(visible) {
    this.visible = visible;

    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getVisible() !== visible) {
        this.children[i].setVisible(visible);
      }
    }
    this.revision++;
  }

  hasVisibleChildren() {
    return !!this.children.find(l => l.getVisible());
  }

  getProperties() {
    return this.props;
  }

  setProperties(p) {
    this.props = p;
    this.revision++;
  }

  getRevision() {
    return this.revision;
  }
}
