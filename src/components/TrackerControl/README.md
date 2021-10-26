
The following example demonstrates the use of TrackerControl.

```jsx
import React from 'react';
import { Layer, TrajservLayer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import BasicMap from 'react-spatial/components/BasicMap';
import TrackerControl from 'react-spatial/components/TrackerControl';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const trackerLayer = new TrajservLayer({
  apiKey: window.apiKey,
  live: false
});

const layers = [
  new Layer({
    olLayer: new Tile({
      source: new OSM(),
    }),
  }),
  trackerLayer,
];

<>
  <BasicMap center={[951560, 6002550]} zoom={14} layers={layers} tabIndex={0} />
  <TrackerControl trackerLayer={trackerLayer} />
</>
```
