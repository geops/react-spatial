#

This demonstrates the use of the StopsFinder component.

```jsx
import React from 'react';
import { Layer } from 'mobility-toolbox-js/ol';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import BasicMap from 'react-spatial/components/BasicMap';
import StopsFinder from 'react-spatial/components/StopsFinder';

const map = new Map({ controls: [] });

const layers = [
  new Layer({
    olLayer: new Tile({
      source: new OSM(),
    }),
  }),
];

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const { apiKey } = window;

<>
  <BasicMap
    map={map}
    center={[951560, 6002550]}
    zoom={14}
    layers={layers}
    tabIndex={0}
  />

  <StopsFinder
    map={map}
    apiKey={apiKey}
    onSelect={({ geometry }) => {
      map.getView().setCenter(fromLonLat(geometry.coordinates));
    }}
    autocompleteProps={{
      textFieldProps: {
        label: 'Search for stops',
      },
    }}
  />
</>
```
