#

The following example demonstrates the use of Zoom.

```jsx
import React from 'react';
import { MapboxLayer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import Zoom from 'react-spatial/components/Zoom';

const map = new Map({ controls: [] });

const layers = [
  new MapboxLayer({
    url: `https://maps.geops.io/styles/travic/style.json?key=${apiKey}`,
  })
];

<div className="rs-zoom-example">
  <BasicMap map={map} layers={layers} tabIndex={0} />
  <Zoom map={map} zoomSlider />
</div>
```
