#

This demonstrates the use of the Search component.

```jsx
import React from 'react';
import { Layer } from 'mobility-toolbox-js/ol';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import BasicMap from 'react-spatial/components/BasicMap';
import Search from 'react-spatial/components/Search';

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

<div className="rt-stop-finder-example">
  <BasicMap
    map={map}
    center={[951560, 6002550]}
    zoom={14}
    layers={layers}
    tabIndex={0}
  />
  <Search
    onSelect={({ geometry }) => {
      map.getView().setCenter(fromLonLat(geometry.coordinates));
    }}
    apiKey={apiKey}
    inputProps={{
      autoFocus: false,
      placeholder: 'Search stops',
    }}
  />
</div>
```
