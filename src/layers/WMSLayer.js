import GeoJSON from 'ol/format/GeoJSON';
import Layer from '../Layer';

/**
 * A class representing WMS layer to display on BasicMap
 * @class
 * @inheritDoc
 */
class WMSLayer extends Layer {
  constructor(options = {}) {
    super(options);

    // Array of click callbacks
    this.clickCallbacks = [];

    // Add click callback
    if (options.onClick) {
      this.onClick(options.onClick);
    }
  }

  /**
   * Get features infos' Url.
   * @param {ol.Coordinate} coord ol.coordinate (https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html)
   * @param {Number} resolution The resolution of the view.
   * @param {ol.Projection|String} projection The projection used by the map.
   */
  getFeatureInfoUrl(coord, resolution, projection) {
    if (this.olLayer.getSource().getGetFeatureInfoUrl) {
      return this.olLayer
        .getSource()
        .getGetFeatureInfoUrl(coord, resolution, projection, {
          info_format: 'application/json',
        });
    }
    return false;
  }

  /**
   * Get features infos for WMS layer.
   * @param {ol.Coordinate} coord ol.coordinate (https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html)
   * @param {number} res The resolution of the view.
   * @param {ol.Projection|String} proj The projection used by the map.
   * @returns {Array<ol.Feature>}
   */
  getFeatureInfoFeatures(coord, res, proj) {
    const url = this.getFeatureInfoUrl(coord, res, proj);
    return fetch(url)
      .then(resp => resp.json())
      .then(r => r.features)
      .then(data => {
        const format = new GeoJSON();
        const features = data.map(d => format.readFeatures(d));
        return features;
      });
  }

  /**
   * Listens to click events on the layer.
   * @param {function} callback Callback function, called with the clicked
   *   features (https://openlayers.org/en/latest/apidoc/module-ol_Feature.html),
   *   the layer instance and the click event.
   */
  onClick(callback) {
    if (typeof callback === 'function') {
      this.clickCallbacks.push(callback);
    } else {
      throw new Error('callback must be of type function.');
    }
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @param {ol.map} map ol.map (https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)
   */
  init(map) {
    super.init(map);
    this.map = map;

    const resolution = this.map.getView().getResolution();
    const projection = this.map.getView().getProjection();

    // Listen to click events
    this.map.on('singleclick', e => {
      if (!this.clickCallbacks.length) {
        return;
      }
      this.getFeatureInfoFeatures(e.coordinate, resolution, projection).then(
        clickedFeatures => {
          this.clickCallbacks.forEach(c => c(clickedFeatures, this, e));
        },
      );
    });
  }
}

export default WMSLayer;
