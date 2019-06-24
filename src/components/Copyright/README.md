#

This demonstrates the use of Copyright.

```js
import React, { Component } from  'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import Footer from 'react-spatial/components/Footer';
import Copyright from 'react-spatial/components/Copyright';

class CopyrightExample extends Component {
  constructor(props) {
    const layerConf = [{
      name: 'OSM Baselayer',
      visible: true,
      copyright: 'OSM Contributors',
      data: {
        type: 'xyz',
        url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    }];

    this.map = new OLMap();
    this.layers = ConfigReader.readConfig(this.map, layerConf);
    this.layerService = new LayerService(this.layers);
  }

  render() {
    return (
      <div className="tm-scale-line-example">
        <BasicMap
          map={this.map}
          zoom={3}
          layers={this.layers}
        />
        <Footer>
          <Copyright layerService={this.layerService} />
        </Footer>
      </div>
    );
  }
}

<CopyrightExample />
```
