/**
 * Function that returns an array of OpenLayers layers or groups as a flat array.
 * It also considers the children property for each layer.
 * @param {*} layersOrLayer
 * @returns
 */
const getLayersAsFlatArray = (layersOrLayer = []) => {
  let layers = layersOrLayer;
  if (!Array.isArray(layers)) {
    layers = [layersOrLayer];
  }
  let flatLayers = [];
  layers.forEach((layer) => {
    flatLayers.push(layer);

    // Handle children property and ol.layer.Group
    const children =
      layer.get("children") ||
      layer.children ||
      layer.getLayers?.()?.getArray();
    flatLayers = flatLayers.concat(getLayersAsFlatArray(children || []));
  });
  return flatLayers;
};

export default getLayersAsFlatArray;
