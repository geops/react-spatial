#

The following example demonstrates the use of Copyright.

```js
import React from  'react';
import { Layer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LayerService from 'react-spatial/LayerService';
import Copyright from 'react-spatial/components/Copyright';

const layers = [
  new Layer({
    copyright: '&copy; OSM Contributors',
    olLayer: new Tile({
      source: new OSM(),
    }),
  })
];

const layerService = new LayerService(layers);

<Copyright layerService={layerService} />
```
