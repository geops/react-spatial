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
      if (
        parentLayer.children.find(c => c === child) &&
        child.getName() === layer.getName()
      ) {
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
    this.getLayers().forEach(layer => {
      if (layer.olLayer) {
        keys.push(layer.olLayer.on(evt, callback));
      }
    });
  }

  listenChangeEvt() {
    const taht = this;
    this.getLayersAsFlatArray().forEach(layer => {
      taht.keys.push(
        layer.on('change:visible', evt => {
          const visible = evt.target.getVisible();
          const parent = taht.getParentLayer(layer);

          // Apply to siblings only if it's a radio group.
          if (
            !evt.stopPropagationSiblings &&
            layer.getRadioGroup() &&
            visible
          ) {
            const siblings = this.getRadioGroupLayers(
              layer.getRadioGroup(),
            ).filter(l => l !== layer);
            // console.log('Apply to siblings', siblings);

            siblings.forEach(s => {
              if (
                visible &&
                s.getRadioGroup() &&
                evt.target.getRadioGroup() === s.getRadioGroup()
              ) {
                // console.log('Apply to Siblings', s, visible);
                s.setVisible(false, evt, false, true, true);
              }
            });
          }

          // Apply to children
          if (!evt.stopPropagationDown && layer.children) {
            // console.log('Apply to children', layer.children);

            layer.children.forEach(child => {
              child.setVisible(visible, evt, false, true, false);
            });
          }

          // Apply to parent only if:
          //   - a child is visible
          //   - all children are hidden
          if (
            !evt.stopPropagationUp &&
            parent &&
            (evt.target.getVisible() ||
              (!evt.target.getVisible() &&
                !parent.children.find(c => c.getVisible())))
          ) {
            // console.log('Apply to parent', parent.getName());
            parent.setVisible(evt.target.getVisible(), evt, true, false, false);
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
}
