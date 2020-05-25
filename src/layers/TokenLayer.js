import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import Layer from './Layer';
/**
 * A class representing a layer that need a token to be renewed.
 * @class
 * @inheritDoc
 * @param {Object} [options]
 */
export default class TokenLayer extends Layer {
  constructor(options = {}) {
    const olLayer =
      options.olLayer ||
      new Image({
        source: new ImageWMS({
          url:
            'https://map.geo.fr.ch/arcgis/services/SIPO/SIPO_Liegenschaften/MapServer/WFSServer',
          params: {
            LAYERS: 'RealEstate',
            CRS: 'EPSG:3857',
          },
        }),
      });

    super({
      ...options,
      olLayer,
    });

    this.username = options.username || 'geops';
    this.password = options.password || 'SIPO2014';
    this.tokenUrl =
      options.tokenUrl ||
      'https://sampleserver6.arcgisonline.com/arcgis/tokens/generateToken';
    this.expiration = options.expiration || 60; // in minutes
    this.onTokenUpdate =
      options.onTokenUpdate ||
      ((token) => {
        this.olLayer.updateParams({
          token,
        });
      });
  }

  /**
   * Initialize the layer. Start requesting a new token every 60 minutes.
   * @param {ol.map} map {@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html ol/Map}
   */
  init(map) {
    super.init(map);

    if (!this.map) {
      return;
    }

    this.startUpdateToken();
  }

  /**
   * @inheritdoc
   */
  terminate() {
    this.stopUpdateToken();
    super.terminate();
  }

  /**
   * Start requesting a new token every 60 minutes. See expiration property.
   * @private
   */
  startUpdateToken() {
    this.stopUpdateToken();
    const body = new FormData();
    body.set('username', this.username);
    body.set('password', this.password);
    body.set('expiration', this.expiration);
    fetch(`${this.tokenUrl}`, {
      method: 'post',
      body,
    })
      .then((response) => response.json())
      .then((data) => {
        this.onTokenUpdate(data.contents);
        this.timeout = setTimeout(this.startUpdateToken, this.expiration - 2);
      });
  }

  /**
   * Stop requesting a new token.
   * @private
   */
  stopUpdateToken() {
    clearTimeout(this.timeout);
  }
}
