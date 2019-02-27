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

  getLayersAsFlatArray(optLayers) {
    let layers = [];
    (optLayers || this.getLayers()).forEach(l => {
      layers.push(l);
      const children = l.getChildren();
      layers = layers.concat(this.getLayersAsFlatArray(children));
    });
    return layers;
  }

  getLayer(name) {
    return this.getLayers().find(l => l.getName() === name);
  }

  getParentLayer(child) {
    return this.getLayersAsFlatArray().find(
      l => !!l.getChildren().includes(child),
    );
  }

  getRadioGroupLayers(radioGroupName) {
    if (!radioGroupName) {
      return null;
    }

    return this.getLayersAsFlatArray().filter(
      l => l.getRadioGroup() === radioGroupName,
    );
  }

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

          const parentLayer = that.getParentLayer(layer);

          if (
            !evt.stopPropagationUp &&
            parentLayer &&
            (visible ||
              (!visible && !parentLayer.children.find(c => c.getVisible())))
          ) {
            parentLayer.setVisible(visible, true, false, false);
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
