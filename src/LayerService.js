/**
 * A layer service class to handle layer adding, removing and visiblity.
 */
export default class LayerService {
  constructor(layers) {
    this.layers = layers;
    this.callbacks = {};
  }

  getLayers() {
    return [...this.layers];
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

  /* on(key, callback) {
    this.callbacks[key] = this.callbacks[key] || [];
    this.callbacks[key].push(callback);
  } */

  on(evt, callback) {
    const keys = [];
    console.log(this);
    this.layers.forEach(layer => {
      keys.push(layer.olLayer.on('change:visible', callback));
    });
  }
}
