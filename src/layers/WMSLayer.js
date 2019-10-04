import GeoJSON from 'ol/format/GeoJSON';
import { unByKey } from 'ol/Observable';
import Layer from './Layer';

/**
 * A class representing WMS layer to display on BasicMap
 * @class
 * @inheritDoc
 * @param {Object} [options]
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
   * @param {ol.Coordinate} coord  {@link https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html ol/Coordinate}
   * @returns {ol.Layer} {@link https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer.html ol/Layer}
   */
  getFeatureInfoUrl(coord) {
    const projection = this.map.getView().getProjection();
    const resolution = this.map.getView().getResolution();

    if (this.olLayer.getSource().getFeatureInfoUrl) {
      return this.olLayer
        .getSource()
        .getFeatureInfoUrl(coord, resolution, projection, {
          info_format: 'application/json',
          query_layers: this.olLayer.getSource().getParams().layers,
        });
    }
    return false;
  }

  /**
   * Request feature information for a given coordinate.
   * @param {ol.Coordinate} coordinate {@link https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html ol/Coordinate} Coordinate to request the information at.
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
        const features = data.map(d => format.readFeature(d));

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
   * @param {ol.map} map {@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html ol/Map}
   */
  init(map) {
    super.init(map);

    if (!this.map) {
      return;
    }

    // Listen to click events
    this.singleClickRef = this.map.on('singleclick', e => {
      if (!this.clickCallbacks.length) {
        return;
      }

      this.getFeatureInfoAtCoordinate(e.coordinate).then(data =>
        this.callClickCallbacks(data.features, data.layer, data.coordinate),
      );
    });
  }

  /**
   * Call click callbacks with given parameters.
   * This is done in a separate function for being able to modify the response.
   * @private
   */
  callClickCallbacks(features, layer, coordinate) {
    this.clickCallbacks.forEach(c => c(features, layer, coordinate));
  }

  /**
   * Terminate what was initialized in init function. Remove layer, events...
   */
  terminate() {
    super.terminate();
    if (this.singleClickRef) {
      unByKey(this.singleClickRef);
    }
  }
}

export default WMSLayer;
