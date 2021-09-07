
The following example demonstrates the use of NorthArrowExample (Alt + Shift + click to rotate).

```jsx
import React from 'react';
import { Layer } from 'mobility-toolbox-js/ol';
import Map from 'ol/Map';
import { DragRotate, defaults } from 'ol/interaction';
import Tile from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileImageSource from 'ol/source/TileImage';
import { getCenter} from 'ol/extent';
import BasicMap from 'react-spatial/components/BasicMap';
import NorthArrow from 'react-spatial/components/NorthArrow';

const extent = [599500, 199309, 600714, 200002];

const map = new Map({ controls: [] });

const layers = [
  new Layer({
    olLayer: new Tile({
      extent,
      source: new TileImageSource({
        tileUrlFunction: c =>
          '//plans.trafimage.ch/static/tiles/' +
          `bern_aussenplan/${c[0]}/${c[1]}/${-c[2]-1}.png`,
        tileGrid: new TileGrid({
          origin: [extent[0], extent[1]],
          resolutions: [
            6.927661,
            3.4638305,
            1.73191525,
            0.865957625,
            0.4329788125,
            0.21648940625,
            0.108244703125,
          ],
        }),
      }),
    }),
  }),
];

<div style={{position:'relative'}}>
  <BasicMap
    map={map}
    center={getCenter(extent)}
    zoom={17}
    layers={layers}
    tabIndex={0}
  />
  <NorthArrow
    map={map}
    rotationOffset={20}
    circled
  />
</div>;
```
