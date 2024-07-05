
The following example demonstrates the use of ScaleLine.

```js
import React, { Component } from  'react';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';
import Map from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import ScaleLine from 'react-spatial/components/ScaleLine';

const map = new Map({ controls: [] });

const layers = [
  new MaplibreLayer({
    mapLibreOptions: {
      style: `https://maps.geops.io/styles/travic_v2/style.json?key=${apiKey}`,
    },
  }),
];

<div style={{position:'relative'}}>
  <BasicMap
    map={map}
    layers={layers}
    tabIndex={0}
  />
  <ScaleLine map={map} />
</div>
```
