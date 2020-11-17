import React from 'react';

import { StopsAPI } from 'mobility-toolbox-js/api';
import Engine from './Engine';

class StopFinder extends Engine {
  constructor(endpoint = 'https://api.geops.io/stops/v1/', options = {}) {
    super();
    this.options = options;
    // apiKey is passed as key in StopsAPI, delete to avoid duplicates.
    delete this.options.apiKey;
    this.api = new StopsAPI({
      url: endpoint,
      apiKey: options.apiKey,
    });
  }

  search(value) {
    return this.api.search({
      q: encodeURIComponent(value),
      ...this.options,
    });
  }

  setApiKey(apiKey) {
    this.api.apiKey = apiKey;
  }

  render(item) {
    return <div>{item.properties.name}</div>;
  }

  static value(item) {
    return item.properties.name;
  }
}

export default StopFinder;
