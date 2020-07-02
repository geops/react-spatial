import React from 'react';

import Engine from './Engine';

class StopFinder extends Engine {
  constructor(endpoint = 'https://api.geops.io/stops/v1/', options = {}) {
    super();
    this.options = options;
    this.endpoint = endpoint;
  }

  search(value) {
    const optionsString = `${Object.keys(this.options)
      .map((p) => `${p}=${this.options[p]}`)
      .join('&')}`;
    return fetch(
      `${this.endpoint}?&q=${encodeURIComponent(value)}&key=${
        this.apiKey
      }&${optionsString}`,
    )
      .then((data) => data.json())
      .then((featureCollection) => featureCollection.features);
  }

  render(item) {
    return <div>{item.properties.name}</div>;
  }

  static value(item) {
    return item.properties.name;
  }
}

export default StopFinder;
