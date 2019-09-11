import { unByKey } from 'ol/Observable';

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

  addLayer(layer) {
    this.layers.push(layer);
  }

  getLayers() {
    return this.layers;
  }

  setLayers(layers) {
    this.layers = layers;
    this.listenChangeEvt();
  }

  getLayersAsFlatArray(optLayers) {
    let layers = [];
    (optLayers || this.getLayers() || []).forEach(l => {
      layers.push(l);
      const children = l.getChildren();
      layers = layers.concat(this.getLayersAsFlatArray(children));
    });
    return layers;
  }

  getLayer(name) {
    return this.getLayersAsFlatArray().find(l => l.getName() === name);
  }

  getParent(child) {
    return this.getLayersAsFlatArray().find(
      l => !!l.getChildren().includes(child),
    );
  }

  getRadioGroupLayers(radioGroupName) {
    if (radioGroupName) {
      return this.getLayersAsFlatArray().filter(
        l => l.getRadioGroup() === radioGroupName,
      );
    }

    return null;
  }

  getBaseLayers() {
    return this.getLayersAsFlatArray().filter(l => l.getIsBaseLayer());
  }

  on(evt, callback) {
    this.un(evt, callback);
    this.callbacks[evt] = this.callbacks[evt] || [];
    this.callbacks[evt].push(callback);
  }

  un(evt, callback) {
    for (let i = 0; i < (this.callbacks[evt] || []).length; i += 1) {
      if (callback === this.callbacks[evt][i]) {
        this.callbacks[evt].splice(i, 1);
        break;
      }
    }
  }

  listenChangeEvt() {
    this.getLayersAsFlatArray().forEach(layer => {
      this.keys.push(
        layer.on('change:visible', evt => {
          const visible = evt.target.getVisible();

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
          const parentLayer = this.getParent(layer);

          if (
            !evt.stopPropagationUp &&
            parentLayer &&
            (visible ||
              (!visible && !parentLayer.children.find(c => c.getVisible())))
          ) {
            parentLayer.setVisible(visible, true, false, false);
          }

          (this.callbacks['change:visible'] || []).forEach(cb =>
            cb(evt.target),
          );
        }),
      );
    });
  }

  unlistenChangeEvt() {
    this.keys.forEach(key => {
      unByKey(key);
    });
  }
}
