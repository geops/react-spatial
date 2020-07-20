#

This demonstrates the use of Zoom.

```jsx
import React from 'react';
import { Layer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import Zoom from 'react-spatial/components/Zoom';

const map = new Map({ controls: [] });

const layers = [
  new Layer({
    olLayer: new Tile({
      source: new OSM(),
    }),
  })
];

<div className="rs-zoom-example">
  <BasicMap map={map} layers={layers} tabIndex={0} />
  <Zoom map={map} zoomSlider />
</div>
```
