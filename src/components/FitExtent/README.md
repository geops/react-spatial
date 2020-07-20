#

This demonstrates the use of FitExtent.

```jsx
import React from 'react';
import { Layer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import FitExtent from 'react-spatial/components/FitExtent';
import BasicMap from 'react-spatial/components/BasicMap';

const extent = [-15380353.1391, 2230738.2886, -6496535.908, 6927029.2369];

const map = new Map({ controls: [] });

const layers = [
  new Layer({
    olLayer: new Tile({
      source: new OSM(),
    }),
  })
];

<>
  <BasicMap map={map} layers={layers} tabIndex={0} />
  <FitExtent map={map} extent={extent}>fit!</FitExtent>
</>
```
