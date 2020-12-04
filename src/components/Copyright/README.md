#

This demonstrates the use of Copyright.

```js
import React from  'react';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {defaults} from 'ol/control';
import { Layer, MapboxLayer } from 'mobility-toolbox-js/ol';
import BasicMap from 'react-spatial/components/BasicMap';
import Copyright from 'react-spatial/components/Copyright';

const map = new Map({
  controls: defaults({
    attribution: false
  })
});

const layers = [
  new MapboxLayer({
    url: `https://maps.geops.io/styles/base_bright_v2/style.json?key=${window.apiKey}`,
  }),
  new Layer({
    copyrights: '&copy; My custom copyright for OSM Contributors',
    olLayer: new Tile({
      source: new OSM(),
    }),
  })
];
window.layers = layers;

<div>
  <BasicMap map={map} layers={layers} tabIndex={0} />
  <Copyright map={map} />
</div>
```
