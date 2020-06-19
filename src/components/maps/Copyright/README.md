#

This demonstrates the use of Copyright.

```js
import React from  'react';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import Copyright from 'react-spatial/components/maps/Copyright';

const layerConf = [{
  name: 'OSM Baselayer',
  visible: true,
  copyright: '&copy; OSM Contributors',
  data: {
    type: 'xyz',
    url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
}];
const layerService = new LayerService(ConfigReader.readConfig(layerConf));

<Copyright layerService={layerService} />
```
