The following example demonstrates the use of Copyright.

```js
import React from 'react';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { defaults } from 'ol/control';
import {  MaplibreLayer } from 'mobility-toolbox-js/ol';
import BasicMap from 'react-spatial/components/BasicMap';
import Copyright from 'react-spatial/components/Copyright';

const map = new Map({
  controls: defaults({
    attribution: false,
  }),
});

const layers = [
  new MaplibreLayer({
    url: `https://maps.geops.io/styles/base_bright_v2/style.json?key=${window.apiKey}`,
  }),
  new Tile({
    source: new OSM({
      attributions: '&copy; My custom copyright for OSM Contributors',
    }),
  }),
];

<div className="rs-copyright-example">
  <BasicMap map={map} layers={layers} tabIndex={0} />
  <Copyright map={map} />
</div>;
```
