#

This demonstrates the use of Copyright.

```js
import React, { Component } from  'react';
import ConfigReader from 'react-spatial/ConfigReader';
import Copyright from 'react-spatial/components/Copyright';

const layerConf = [{
  name: 'OSM Baselayer',
  visible: true,
  copyright: 'OSM Contributors',
  data: {
    type: 'xyz',
    url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
}];
const layers = ConfigReader.readConfig(layerConf);

<Copyright layers={layers} />
```
