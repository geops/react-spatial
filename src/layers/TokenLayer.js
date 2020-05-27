import Layer from './Layer';
/**
 * A class representing a layer that need a token to be renewed.
 * @class
 * @inheritDoc
 * @param {Object} [options]
 */
export default class TokenLayer extends Layer {
  constructor(options = {}) {
    super({
      ...options,
    });
    this.username = options.username;
    this.password = options.password;
    this.tokenUrl = options.tokenUrl;
    this.expiration = options.expiration || 60; // in minutes
    this.onTokenUpdate = options.onTokenUpdate;
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

    this.startTokenUpdate();
  }

  /**
   * @inheritdoc
   */
  terminate() {
    this.stopTokenUpdate();
    super.terminate();
  }

  /**
   * Start requesting a new token every 60 minutes. See expiration property.
   * @private
   */
  startTokenUpdate() {
    this.stopTokenUpdate();
    fetch(`${this.tokenUrl}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `username=${this.username}&password=${this.password}&expiration=${this.expiration}`,
    })
      .then((response) => {
        return response.text().then((text) => {
          if (!response.ok || /Invalid/.test(text)) {
            // When user/pass is wrong
            throw new Error(text);
          }
          return text;
        });
      })
      .then((token) => {
        this.onTokenUpdate(token, this);
        this.timeout = setTimeout(
          () => this.startTokenUpdate(),
          this.expiration * 60 * 1000 - 10000, // 10 seconds before expiration
        );
      });
  }

  /**
   * Stop requesting a new token.
   * @private
   */
  stopTokenUpdate() {
    clearTimeout(this.timeout);
  }
}
