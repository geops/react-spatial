#

This demonstrates the use of ScaleLine.

```js
import React, { Component } from  'react';
import { Layer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import ScaleLine from 'react-spatial/components/ScaleLine';

const map = new Map({ controls: [] });

const layers = [
    new Layer({
    olLayer: new Tile({
      source: new OSM(),
    }),
  })
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
