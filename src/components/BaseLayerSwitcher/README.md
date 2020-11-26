#

This demonstrates the use of BaseLayerSwitcher.

```jsx
import React from 'react';
import Map from 'ol/Map';
import BaseLayerSwitcher from 'react-spatial/components/BaseLayerSwitcher';
import BasicMap from 'react-spatial/components/BasicMap';
import { MapboxLayer, Layer } from 'mobility-toolbox-js/ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import osmImage from 'react-spatial/images/baselayer/baselayer.osm.png';
import travicImage from 'react-spatial/images/baselayer/baselayer.travic.png';
import basebrightImage from 'react-spatial/images/baselayer/baselayer.basebright.png';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const { apiKey } = window;

const center = [1149722.7037660484, 6618091.313553318];
const map = new Map({ controls: [] });
const travicLayer = new MapboxLayer({
  url: `https://maps.geops.io/styles/travic/style.json?key=${apiKey}`,
  name: 'Travic',
  key: 'travic.baselayer',
  isBaseLayer: true,
  visible: true
});

const basebrightLayer = new MapboxLayer({
  url: `https://maps.geops.io/styles/base_bright_v2/style.json?key=${apiKey}`,
  name: 'Base - Bright',
  key: 'basedark.baselayer',
  isBaseLayer: true,
  visible: false
});

const osmLayer = new Layer({
  olLayer: new TileLayer({
    source: new XYZ({
      url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      crossOrigin: 'Anonymous',
      transition: 0,
    }),
  }),
  name: 'OSM',
  key: 'osm.baselayer',
  visible: false,
  isBaseLayer: true,
});

const layerImages = {
  'travic.baselayer': travicImage,
  'basedark.baselayer': basebrightImage,
  'osm.baselayer': osmImage,
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
