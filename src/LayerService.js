import Observable from 'ol/Observable';

/**
 * A layer service class to handle layer adding, removing and visiblity.
 */
export default class LayerService {
  constructor(layers) {
    this.layers = layers;
    this.callbacks = {};
    this.keys = [];

    this.listenChangeEvt();
  }

  getLayers() {
    return [...this.layers];
  }

  getLayersAsFlatArray(layers) {
    let arr = [];
    const layerss = layers || this.getLayers();
    for (let i = 0; i < layerss.length; i += 1) {
      arr.push(layerss[i]);
      if (layerss[i].children) {
        arr = arr.concat(this.getLayersAsFlatArray(layerss[i].children));
      }
    }
    return arr;
  }

  getLayersNames() {
    const namesArray = [];
    const layers = this.getLayers();
    for (let i = 0; i < layers.length; i += 1) {
      namesArray.push(layers[i].getName());
    }
    return namesArray;
  }

  doesLayerExist(layerName) {
    return this.getLayersNames().indexOf(layerName) > -1;
  }

  getLayer(name) {
    const layers = this.getLayers();
    for (let i = 0; i < layers.length; i += 1) {
      if (layers[i].getName() === name) {
        return layers[i];
      }
    }
    return null;
  }

  getParentLayer(child) {
    const layers = this.getLayersAsFlatArray();
    let parentLayer;
    for (let i = 0; i < layers.length; i += 1) {
      const layer = layers[i];
      if (layer.children) {
        parentLayer = layer;
      }
      if (child.getName() === layer.getName()) {
        return parentLayer;
      }
    }
  }

  getRadioGroupLayers(radioGroupName) {
    const groupLayers = [];
    const layers = this.getLayersAsFlatArray();
    for (let i = 0; i < layers.length; i += 1) {
      if (
        layers[i].getRadioGroup() &&
        layers[i].getRadioGroup() === radioGroupName
      ) {
        groupLayers.push(layers[i]);
      }
    }
    return groupLayers.length ? groupLayers : null;
  }

  /* on(key, callback) {
    this.callbacks[key] = this.callbacks[key] || [];
    this.callbacks[key].push(callback);
  } */

  on(evt, callback) {
    const keys = [];
    console.log(this);
    this.layers.forEach(layer => {
      if (layer.olLayer) {
        keys.push(layer.olLayer.on('change', callback));
      }
    });
  }

  listenChangeEvt() {
    const taht = this;
    console.log(this.getLayersAsFlatArray());
    this.getLayersAsFlatArray().forEach(layer => {
      taht.keys.push(
        layer.olLayer.on('change:visible', evt => {
          // Apply to radio group
          // Apply to children
          if (layer.children) {
            console.log('Apply to children', layer.getName());
            taht.applyToChildren(layer.children, evt.target.getVisible());
          }
          // Apply to parent
          const parent = taht.getParentLayer(layer);
          if (parent) {
            console.log('Apply to parent', parent.getName());
            taht.applyToParent(parent, evt.target.getVisible());
          }
        }),
      );
    });
  }

  unlistenChangeEvt() {
    this.keys.forEach(key => {
      Observable.unByKey(key);
    });
  }

  applyToParent(parent, visible) {
    if (parent.hasChildren(visible)) {
      console.log('Apply to parent', parent.getName(), visible);
      parent.setVisible(visible);
    }
  }

  applyToChildren(children, visible) {
    for (let i = 0; i < children.length; i += 1) {
      if (children[i].getVisible() !== visible) {
        console.log('Apply to children', children[i].getName());
        children[i].setVisible(visible);
      }
    }
  }
}
