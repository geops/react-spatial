#

The following example demonstrates the use of Geolocation.

```jsx
import React from 'react';
import { MapboxLayer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import Geolocation from 'react-spatial/components/Geolocation';
import BasicMap from 'react-spatial/components/BasicMap';

const map = new Map({ controls: [] });

const layers = [
  new MapboxLayer({
    url: `https://maps.geops.io/styles/travic/style.json?key=${apiKey}`,
  }),
];

<div className="rs-geolocation-example">
  <BasicMap map={map} layers={layers} tabIndex={0} />
  <Geolocation map={map} />
</div>
```
