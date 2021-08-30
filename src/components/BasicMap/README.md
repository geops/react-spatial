
The following example demonstrates the use of BasicMap.

```jsx
import React from 'react';
import { MapboxLayer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import BasicMap from 'react-spatial/components/BasicMap';

const layers = [
  new MapboxLayer({
    url: `https://maps.geops.io/styles/travic_v2/style.json?key=${apiKey}`,
  })
];

<BasicMap layers={layers} tabIndex={0} />;
```
