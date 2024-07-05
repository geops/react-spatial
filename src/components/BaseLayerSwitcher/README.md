The following example demonstrates the use of BaseLayerSwitcher:

```jsx
import React from 'react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';
import BaseLayerSwitcher from 'react-spatial/components/BaseLayerSwitcher';
import BasicMap from 'react-spatial/components/BasicMap';
import osmImage from 'react-spatial/images/baselayer/baselayer.osm.png';
import travicImage from 'react-spatial/images/baselayer/baselayer.travic.png';
import basebrightImage from 'react-spatial/images/baselayer/baselayer.basebright.png';

const center = [1149722.7037660484, 6618091.313553318];
const map = new Map({ controls: [] });
const travicLayer = new MaplibreLayer({
  key: 'travic.baselayer',
  mapLibreOptions:{
    style:`https://maps.geops.io/styles/travic_v2/style.json?key=${apiKey}`,
  },
  name: 'Travic',
});

const basebrightLayer = new MaplibreLayer({
  key: 'basebright.baselayer',
  mapLibreOptions:{
    style:`https://maps.geops.io/styles/base_bright_v2/style.json?key=${apiKey}`,
  },
  name: 'Base - Bright',
  visible: false,
});

const osmLayer = new TileLayer({
  key: 'osm.baselayer',
  name: 'OSM',
  source: new OSM(),
  visible: false,
});

const layerImages = {
  'travic.baselayer': travicImage,
  'basebright.baselayer': basebrightImage,
  'osm.baselayer':  osmImage,
};

const layers = [travicLayer, basebrightLayer, osmLayer];

<div className="rs-base-layer-example">
  <BasicMap
    map={map}
    center={center}
    zoom={6}
    layers={layers}
    tabIndex={0}
  />
  <BaseLayerSwitcher
    layers={layers}
    layerImages={layerImages}
  />
</div>;
```
