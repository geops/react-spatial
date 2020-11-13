#

This demonstrates the use of Copyright.

```js
import React from  'react';
import { Layer, MapboxLayer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LayerService from 'react-spatial/LayerService';
import Copyright from 'react-spatial/components/Copyright';
import BasicMap from 'react-spatial/components/BasicMap';

const layers = [
  new Layer({
    copyright: '&copy; OSM Contributors',
    olLayer: new Tile({
      source: new OSM(),
    }),
  }),
  new Layer({
    copyright: '&copy; test2',
    olLayer: new Tile({
      source: new OSM(),
    }),
  }),
  new Layer({
    copyright: '&copy; OSM Contributors',
    olLayer: new Tile({
      source: new OSM(),
    }),
  }),
  new MapboxLayer({
    url: `https://maps.geops.io/styles/travic/style.json?key=${window.apiKey}`,
  }),
  new MapboxLayer({
    url: `https://maps.geops.io/styles/travic/style.json?key=${window.apiKey}`,
  }),
];

const layerService = new LayerService(layers);

<>
  <BasicMap layers={layers} />
  <Copyright layerService={layerService} />
</>
```
