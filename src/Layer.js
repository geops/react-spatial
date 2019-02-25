import OLGroup from 'ol/layer/Group';
/**
 * A class representing layer to display on BasicMap with a name, a visibility,
 * a radioGroup, astatus and
 * an [ol/layer/Layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)
 */
export default class Layer {
  constructor({ name, olLayer, radioGroup, isBaseLayer, visible }) {
    this.name = name;
    this.olLayer = olLayer;
    this.isBaseLayer = isBaseLayer;
    this.radioGroup = radioGroup;
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

  getIsBaseLayer() {
    return this.isBaseLayer;
  }

  getRadioGroup() {
    return this.radioGroup;
  }

  setRadioGroup(radioGroup) {
    this.radioGroup = radioGroup;
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

  getChildren() {
    if (this.olLayer instanceof OLGroup) {
      return this.olLayer.getLayers();
    }
    return [];
  }

  getProperties() {
    return this.olLayer.getProperties();
  }

  setProperties(p) {
    this.olLayer.setProperties(p);
  }

  getParentId() {
    return this.olLayer.getProperties().parentId;
  }

  getRevision() {
    return this.olLayer.getRevision();
  }
}
