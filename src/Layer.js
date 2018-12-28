/**
 * A class representing layer to display an BasicMap with a name, a visibility
 * status and an [ol/layer/Layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)
 *
 */
export default class Layer {
  constructor({ name, olLayer, visible }) {
    this.name = name;
    this.olLayer = olLayer;

    this.visible = typeof visible === 'undefined' ? true : visible;
    this.setVisible(this.visible);
  }

  init(map) {
    this.map = map;
    map.addLayer(this.olLayer);
  }

  getName() {
    return this.name;
  }

  getVisible() {
    return this.visible;
  }

  changed() {
    this.olLayer.changed();
  }

  setStyle(style) {
    this.olLayer.setStyle(style);
  }

  setVisible(visible) {
    this.visible = visible;
    this.olLayer.setVisible(visible);
  }
}
