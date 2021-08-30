The following example demonstrates the use of BaseLayerToggler:

```jsx
import React from 'react';
import Map from 'ol/Map';
import { Layer } from 'mobility-toolbox-js/ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import BaseLayerToggler from 'react-spatial/components/BaseLayerToggler';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';

const center = [1149722.7037660484, 6618091.313553318];
const map = new Map({ controls: [] });
const osmHotLayer = new Layer({
  olLayer: new TileLayer({
    source: new XYZ({
      url: 'https://c.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      crossOrigin: 'Anonymous',
      transition: 0,
    }),
  }),
  name: 'OSM Hot',
  key: 'osm.baselayer.hot',
  visible: false,
  isBaseLayer: true,
});

const osmTopoLayer = new Layer({
  olLayer: new TileLayer({
    source: new XYZ({
      url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
      crossOrigin: 'Anonymous',
      transition: 0,
    }),
  }),
  name: 'OpenTopoMap',
  key: 'open.topo.map',
  visible: false,
  isBaseLayer: true,
});

const osmLayer = new Layer({
  olLayer: new TileLayer({
    source: new OSM(),
  }),
  name: 'OSM',
  key: 'osm.baselayer',
  isBaseLayer: true,
  visible: true,
});

const layers = [osmLayer, osmHotLayer, osmTopoLayer];

const layerService = new LayerService(layers);

<div className="rs-base-layer-example">
  <BasicMap
    map={map}
    center={center}
    zoom={6}
    layers={layers}
    tabIndex={0}
  />
  <BaseLayerToggler
    map={map}
    layerService={layerService}
  />
</div>;
```
