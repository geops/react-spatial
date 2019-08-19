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
   */
  getFeatureInfoUrl(coord) {
    const projection = this.map.getView().getProjection();
    const resolution = this.map.getView().getResolution();

    if (this.olLayer.getSource().getGetFeatureInfoUrl) {
      return this.olLayer
        .getSource()
        .getGetFeatureInfoUrl(coord, resolution, projection, {
          info_format: 'application/json',
          query_layers: this.olLayer.getSource().getParams().layers,
        });
    }
    return false;
  }

  /**
   * Request feature information for a given coordinate.
   * @param {ol.Coordinate} coordinate Coordinate to request the information at.
   * @returns {Promise<Object>} Promise with features, layer and coordinate
   *  or null if no feature was hit.
   * eslint-disable-next-line class-methods-use-this
   */
  getFeatureInfoAtCoordinate(coordinate) {
    return fetch(this.getFeatureInfoUrl(coordinate))
      .then(resp => resp.json())
      .then(r => r.features)
      .then(data => {
        const format = new GeoJSON();
        const features = data.map(d => format.readFeatures(d));

        return {
          features,
          coordinate,
          layer: this,
        };
      })
      .catch(() => {
        // resolve an empty feature array something fails
        Promise.resolve({
          features: [],
          coordinate,
          layer: this,
        });
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
   * @inheritDoc
   */
  init(map) {
    super.init(map);
    this.map = map;

    // Listen to click events
    this.map.on('singleclick', e => {
      if (!this.clickCallbacks.length) {
        return;
      }

      this.getFeatureInfoAtCoordinate(e.coordinate).then(data => {
        this.clickCallbacks.forEach(c =>
          c(data.features, data.layer, data.coordinate),
        );
      });
    });
  }
}

export default WMSLayer;
