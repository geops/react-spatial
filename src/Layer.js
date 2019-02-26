import OLGroup from 'ol/layer/Group';
import Observable from 'ol/Observable';
/**
 * A class representing layer to display on BasicMap with a name, a visibility,
 * a radioGroup, astatus and
 * an [ol/layer/Layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html)
 */
export default class Layer extends Observable {
  constructor({ name, olLayer, radioGroup, isBaseLayer }) {
    super();
    this.name = name;
    this.olLayer = olLayer;
    this.isBaseLayer = isBaseLayer;
    this.radioGroup = radioGroup;
  }

  init(map) {
    this.map = map;
    map.addLayer(this.olLayer);
  }

  getName() {
    return this.name;
  }

  getVisible() {
    return this.olLayer.getVisible();
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

  setVisible(
    visible,
    evt,
    stopPropagationDown = false,
    stopPropagationUp = false,
    stopPropagationSiblings = false,
  ) {
    if (evt && evt.initialTarget === this) {
      return;
    }
    if (visible === this.olLayer.getVisible()) {
      return;
    }
    this.olLayer.setVisible(visible);
    this.dispatchEvent({
      type: 'change:visible',
      target: this,
      initialTarget: (evt && evt.initialTarget) || this,
      stopPropagationDown,
      stopPropagationUp,
      stopPropagationSiblings,
    });
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
