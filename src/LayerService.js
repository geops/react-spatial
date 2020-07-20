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
    // When we change the layers we trigger an change:layers event
    (this.callbacks['change:layers'] || []).forEach((cb) => cb(layers));
  }

  getLayersAsFlatArray(optLayers) {
    let layers = [];
    (optLayers || this.getLayers() || []).forEach((l) => {
      layers.push(l);
      const { children } = l;
      layers = layers.concat(this.getLayersAsFlatArray(children));
    });
    return layers;
  }

  getLayer(name) {
    return this.getLayersAsFlatArray().find((l) => l.name === name);
  }

  getParent(child) {
    return this.getLayersAsFlatArray().find(
      (l) => !!l.children.includes(child),
    );
  }

  getParents(child) {
    let layer = child;
    const parents = [];

    let parentLayer;
    do {
      parentLayer = this.getParent(layer);
      if (parentLayer) {
        parents.push(parentLayer);
        layer = parentLayer;
      }
    } while (parentLayer);

    return parents;
  }

  getRadioGroupLayers(radioGroupName) {
    if (radioGroupName) {
      return this.getLayersAsFlatArray().filter(
        (l) => l.get('radioGroup') === radioGroupName,
      );
    }

    return null;
  }

  getBaseLayers() {
    return this.getLayersAsFlatArray().filter((l) => l.isBaseLayer);
  }

  getQueryableLayers() {
    return this.getLayersAsFlatArray().filter(
      (layer) => layer.visible && layer.isQueryable,
    );
  }

  getFeatureInfoAtCoordinate(coordinate, layers) {
    const promises = (layers || this.getQueryableLayers()).map((layer) => {
      return layer
        .getFeatureInfoAtCoordinate(coordinate)
        .then((featureInfo) => {
          return featureInfo;
        });
    });
    return Promise.all(promises);
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
    this.getLayersAsFlatArray().forEach((layer) => {
      this.keys.push(
        layer.on('change:copyright', (evt) => {
          (this.callbacks['change:copyright'] || []).forEach((cb) =>
            cb(evt.target),
          );
        }),
        layer.on('change:visible', (evt) => {
          const { visible } = evt.target;

          // Apply to siblings only if it's a radio group.
          if (
            !evt.stopPropagationSiblings &&
            layer.get('radioGroup') &&
            visible
          ) {
            const siblings = this.getRadioGroupLayers(
              layer.get('radioGroup'),
            ).filter((l) => l !== layer);

            siblings.forEach((s) => {
              if (
                visible &&
                s.get('radioGroup') &&
                evt.target.get('radioGroup') === s.get('radioGroup')
              ) {
                s.setVisible(false, false, true, true);
              }
            });
          }

          // Apply to children
          if (!evt.stopPropagationDown && layer.children) {
            layer.children.forEach((child) => {
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
              (!visible && !parentLayer.children.find((c) => c.visible)))
          ) {
            parentLayer.setVisible(visible, true, false, false);
          }

          (this.callbacks['change:visible'] || []).forEach((cb) =>
            cb(evt.target),
          );
        }),
      );
    });
  }
}
