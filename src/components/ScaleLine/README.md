#

This demonstrates the use of ScaleLine.

```js
import React, { Component } from  'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import OLMap from 'ol/Map';
import ScaleLine from 'react-spatial/components/ScaleLine';

class ScaleLineExample extends Component {
  constructor(props) {
    const layerConf = [{
      name: 'OSM Baselayer',
      visible: true,
      data: {
        type: 'xyz',
        url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    }];

    this.map = new OLMap();
    this.layers = ConfigReader.readConfig(layerConf);
  }

  render() {
    return (
      <div style={{position:'relative'}}>
        <BasicMap
          map={this.map}
          zoom={3}
          layers={this.layers}
        />
        <ScaleLine map={this.map} />
      </div>
    );
  }
}

<ScaleLineExample />
```
