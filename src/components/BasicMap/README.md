#

This demonstrates the use of BasicMap.

```jsx
import React from 'react';
import { Layer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import BasicMap from 'react-spatial/components/BasicMap';

const layers = [
  new Layer({
    olLayer: new Tile({
      source: new OSM(),
    }),
  })
];

<BasicMap layers={layers} tabIndex={0} />;
```
