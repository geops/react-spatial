/**
 * A layer service class to handle layer adding, removing and visiblity.
 */
import { mutateTree } from '@atlaskit/tree';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import WMTSSource from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import GeoJSONFormat from 'ol/format/GeoJSON';

import Layer from './Layer';
import VectorLayer from './VectorLayer';

export default class LayerService {
  static areOthersSiblingsUncheck(tree, item) {
    const parent = tree.items[item.parentId];
    return !parent.children
      .filter(id => id !== item.id)
      .find(id => tree.items[id].isChecked);
  }

  static isLayer(data) {
    return Object.prototype.hasOwnProperty.call(data, 'type');
  }

  static createXYZLayer(data) {
    return new Layer({
      name: data.title,
      olLayer: new TileLayer({
        zIndex: -1,
        source: new XYZ({
          url: data.url,
        }),
      }),
    });
  }

  constructor({ map, treeData, dataStyle }) {
    this.wmtsResolutions = [
      156543.033928,
      78271.516964,
      39135.758482,
      19567.879241,
      9783.9396205,
      4891.96981025,
      2445.98490513,
      1222.99245256,
      611.496226281,
      305.748113141,
      152.87405657,
      76.4370282852,
      38.2185141426,
      19.1092570713,
      9.55462853565,
      4.77731426782,
      2.38865713391,
      1.19432856696,
      0.597164283478,
      0.298582141739,
    ];

    this.wmtsMatrixIds = this.wmtsResolutions.map((res, i) => `${i}`);

    this.projectionExtent = [
      -20037508.3428,
      -20037508.3428,
      20037508.3428,
      20037508.3428,
    ];

    this.projection = map.getView().getProjection();
    this.dataStyle = dataStyle;

    const { items } = treeData;
    this.treeData = treeData;
    this.map = map;

    this.layers = [];

    Object.keys(items).forEach(layer => {
      if (LayerService.isLayer(items[layer].data)) {
        if (items[layer].isChecked === true) {
          this.addLayer(this.map, items[layer].data);
        }
      }
    });
  }

  getStyle(styleId) {
    if (Object.prototype.hasOwnProperty.call(this.dataStyle.default, styleId)) {
      return this.dataStyle.default[styleId];
    }
    return undefined;
  }

  createWMTSLayer(data) {
    return new Layer({
      name: data.title,
      olLayer: new TileLayer({
        zIndex: -1,
        source: new WMTSSource({
          url: data.url,
          tileGrid: new WMTSTileGrid({
            extent: this.projectionExtent,
            resolutions: this.wmtsResolutions,
            matrixIds: this.wmtsMatrixIds,
          }),
        }),
      }),
    });
  }

  createVectorLayer(data) {
    return new VectorLayer({
      name: data.title,
      source: new VectorSource({
        url: data.url,
        format: new GeoJSONFormat(),
      }),
      style: data.styleId ? this.getStyle(data.styleId) : undefined,
    });
  }

  createLayer(data) {
    if (data.type === 'xyz') {
      return LayerService.createXYZLayer(data);
    }
    if (data.type === 'wmts') {
      return this.createWMTSLayer(data);
    }
    if (data.type === 'vectorLayer') {
      return this.createVectorLayer(data);
    }
    return undefined;
  }

  getLayers() {
    return this.layers;
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

  addLayer(map, data) {
    const layer = this.createLayer(data);
    map.addLayer(layer.olLayer);
    this.layers.unshift(layer);
  }

  applyMutationToMap(layerId, mutation) {
    const { data } = this.treeData.items[layerId];
    if (LayerService.isLayer(data)) {
      if (mutation.isChecked) {
        if (!this.doesLayerExist(data.title)) {
          this.addLayer(this.map, data);
        }
        this.getLayer(data.title).olLayer.setVisible(true);
      } else {
        this.getLayer(data.title).olLayer.setVisible(false);
      }
    }
  }

  applyToItem(tree, item, mutation) {
    let newTree = tree;
    const newMutation = { ...mutation };
    // We remove all the unecessary mutations.
    Object.keys({ ...mutation }).forEach(key => {
      if (item[key] === mutation[key]) {
        delete newMutation[key];
      }
    });

    // No mutation to apply
    if (!Object.keys(newMutation).length) {
      return newTree;
    }
    newTree = this.mutateTree(newTree, item.id, newMutation);
    this.applyMutationToMap(item.id, newMutation);
    return newTree;
  }

  /**
   * Apply a mutation to all the parents recursively.
   */
  applyToParents(tree, item, mutation) {
    let newTree = tree;
    const parent = newTree.items[item.parentId];

    if (!parent) {
      return newTree;
    }

    // if parent is radio input going to be checked
    if (parent.type === 'radio') {
      const radioSiblings = parent.children.filter(
        id =>
          id !== item.id &&
          tree.items[id].type === 'radio' &&
          tree.items[id].isChecked === true,
      );
      // Uncheck all radio siblings and their children.
      const newMutation = {
        isChecked: false,
        isExpanded: false,
      };

      for (let i = 0; i < radioSiblings.length; i += 1) {
        newTree = this.applyToItem(
          newTree,
          newTree.items[radioSiblings[i]],
          newMutation,
        );
        newTree = this.applyToChildren(
          newTree,
          newTree.items[radioSiblings[i]],
          newMutation,
        );
      }
    }

    // Apply to parents if all the others siblings are uncheck.
    if (LayerService.areOthersSiblingsUncheck(newTree, item)) {
      newTree = this.applyToItem(newTree, parent, mutation);
      newTree = this.applyToParents(newTree, parent, mutation);
    }
    return newTree;
  }

  /**
   * Apply a mutation to all the children recursively.
   */
  applyToChildren(tree, item, mutation, isIgnoredFunc, isTypeIgnoredFunction) {
    let newTree = tree;
    let newMutation = { ...mutation };
    let firstRadioInput;

    // Go through all the children.
    tree.items[item.id].children.forEach(childId => {
      const child = newTree.items[childId];

      if (
        (isTypeIgnoredFunction && isTypeIgnoredFunction(child)) ||
        (isIgnoredFunc && isIgnoredFunc(child))
      ) {
        return;
      }

      // If no mutation provided we apply the default values.
      if (!mutation && child.defaults) {
        newMutation = { ...child.defaults };
      } else if (!mutation) {
        // If no mutation provided, we do nothing.
        return;
      }

      // if a radio input is going to be checked, uncheck all the other member of the group.
      if (firstRadioInput && newMutation.isChecked && child.type === 'radio') {
        // Uncheck all the radio inputs of the same group.
        newTree = this.applyToItem(newTree, child, {
          isChecked: false,
          isExpanded: false,
        });
        return;
      }

      newTree = this.applyToItem(newTree, child, newMutation);

      // Set isRadioInput to true will ignore the other member of radio group.
      if (!firstRadioInput && child.type === 'radio') {
        firstRadioInput = child;
      }

      if (child.hasChildren) {
        newTree = this.applyToChildren(
          newTree,
          child,
          newMutation,
          isIgnoredFunc,
        );
      }
    });
    return newTree;
  }

  getTree() {
    return this.treeData;
  }

  setTree(newTree) {
    this.treeData = newTree;
  }

  mutateTree(tree, itemId, mutation) {
    const newTree = mutateTree(tree, itemId, mutation);
    this.applyMutationToMap(itemId, mutation);
    return newTree;
  }

  updateTree(item) {
    const tree = this.getTree();
    const value = !item.isChecked;
    let newTree = tree;
    if (item.type === 'radio') {
      // Input radio automatically expand/collapse if is a Topic (parent=root).
      const isExpanded = item.parentId === 'root' ? value : item.hasChildren;
      newTree = this.mutateTree(newTree, item.id, {
        isChecked: value,
        isExpanded,
      });
      // Apply to parents if all the others siblings are uncheck.
      newTree = this.applyToParents(newTree, item, {
        isChecked: value,
        isExpanded: newTree.items[item.parentId].hasChildren,
      });

      // On check
      if (value) {
        // Apply the default values of children.
        newTree = this.applyToChildren(newTree, item);

        // Uncheck all the radio inputs of the same group.
        newTree = this.applyToChildren(
          newTree,
          newTree.items[item.parentId],
          {
            isChecked: !value,
            isExpanded: !value,
          },
          child => child.id === item.id,
          child => child.type === 'checkbox',
        );

        // On uncheck
      } else {
        // Uncheck all the children.
        newTree = this.applyToChildren(newTree, item, {
          isChecked: value,
          isExpanded: value,
        });
      }
    } else if (item.type === 'checkbox') {
      const mutation = {
        isChecked: value,
        isExpanded: newTree.items[item.parentId].hasChildren,
      };
      newTree = this.mutateTree(newTree, item.id, mutation);

      // Apply to parents if all the others siblings are uncheck.
      newTree = this.applyToParents(newTree, item, mutation);

      // On check/uncheck:
      //   - for input checkbox -> check/uncheck all the children.
      //   - for input radio -> check/uncheck only one of the children.
      newTree = this.applyToChildren(newTree, item, mutation);
    }
    this.setTree(newTree);
  }

  onItemChange(itemId) {
    const item = this.getTree().items[itemId];
    this.updateTree(item);
    return this.treeData;
  }

  onItemToggle(item) {
    const tree = this.getTree();
    const newTree = this.mutateTree(tree, item.id, {
      isExpanded: !item.isExpanded,
    });
    this.setTree(newTree);
    return this.treeData;
  }
}
