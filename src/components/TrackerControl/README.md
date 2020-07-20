#

This demonstrates the use of TrackerControl.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import { Layer, TrajservLayer } from 'mobility-toolbox-js/ol/';
import TileLayer from 'ol/layer/Tile';
import OSMSource from 'ol/source/OSM';
import TrackerControl from 'react-spatial/components/TrackerControl';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const trackerLayer = new TrajservLayer({
  apiKey: window.apiKey,
});

const layers = [
  new Layer({
    name: 'Layer',
    olLayer: new TileLayer({
      source: new OSMSource(),
    }),
  }),
  trackerLayer,
];

function TrackerControlExample() {
  return (
    <>
      <BasicMap center={[951560, 6002550]} zoom={14} layers={layers} tabIndex={0} />
      <TrackerControl trackerLayer={trackerLayer} />
    </>
  );
}

<TrackerControlExample />;
```