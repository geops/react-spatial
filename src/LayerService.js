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
    return this.layers;
  }

  getLayersAsFlatArray(layers) {
    let arr = [];
    (layers || this.getLayers()).forEach(l => {
      arr.push(l);
      if (l.children) {
        arr = arr.concat(this.getLayersAsFlatArray(l.children));
      }
    });
    return arr;
  }

  doesLayerExist(name) {
    const layers = this.getLayersAsFlatArray();
    return layers.some(layer => name === layer.getName());
  }

  getLayer(name) {
    const layers = this.getLayersAsFlatArray();
    return layers.find(layer => name === layer.getName());
  }

  getParentLayer(child) {
    const layers = this.getLayersAsFlatArray();
    let parentLayer;
    for (let i = 0; i < layers.length; i += 1) {
      const layer = layers[i];
      if (layer.children) {
        parentLayer = layer;
      }
      if (parentLayer && parentLayer.children.find(c => c === child)) {
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
        keys.push(layer.olLayer.on('change', callback));
      }
    });
  }

  listenChangeEvt() {
    const that = this;
    this.getLayersAsFlatArray().forEach(layer => {
      that.keys.push(
        layer.on('change:visible', evt => {
          const visible = evt.target.getVisible();
          const parent = that.getParentLayer(layer);

          // Apply to siblings only if it's a radio group.
          if (
            !evt.stopPropagationSiblings &&
            layer.getRadioGroup() &&
            visible
          ) {
            const siblings = this.getRadioGroupLayers(
              layer.getRadioGroup(),
            ).filter(l => l !== layer);

            siblings.forEach(s => {
              if (
                visible &&
                s.getRadioGroup() &&
                evt.target.getRadioGroup() === s.getRadioGroup()
              ) {
                s.setVisible(false, false, true, true);
              }
            });
          }

          // Apply to children
          if (!evt.stopPropagationDown && layer.children) {
            layer.children.forEach(child => {
              child.setVisible(visible, false, true, false);
            });
          }

          // Apply to parent only if:
          //   - a child is visible
          //   - all children are hidden
          if (
            !evt.stopPropagationUp &&
            parent &&
            (visible ||
              (!visible && !parent.children.find(c => c.getVisible())))
          ) {
            parent.setVisible(visible, true, false, false);
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
