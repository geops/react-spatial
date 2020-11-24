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
import ConfigReader from 'react-spatial/ConfigReader';
import osmImage from 'react-spatial/images/baselayer/osm.baselayer.png';
import osmhotImage from 'react-spatial/images/baselayer/osm.baselayer.hot.png';
import openTopoImage from 'react-spatial/images/baselayer/open.topo.map.png';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const { apiKey } = window;

const center = [1149722.7037660484, 6618091.313553318];
const map = new Map({ controls: [] });
const layers = ConfigReader.readConfig(treeData);
const layer1 = new MapboxLayer({
  url: `https://maps.geops.io/styles/travic/style.json?key=${apiKey}`,
  name: 'Travic',
  key: 'travic.baselayer',
  isBaseLayer: true,
  copyright: '© OSM Contributors',
});

const layer2 = new MapboxLayer({
  url: `https://maps.geops.io/styles/base_dark_v2/style.json?key=${apiKey}`,
  name: 'Base Dark',
  key: 'basedark.baselayer',
  isBaseLayer: true,
  copyright: '© OSM Contributors',
});

layer2.setVisible(false);

const layer3 = new Layer({
  olLayer: new TileLayer({
    source: new XYZ({
      url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      crossOrigin: 'Anonymous',
      transition: 0,
    }),
  }),
  name: 'OSM',
  key: 'osm.baselayer',
  visible: true,
  isBaseLayer: true,
  copyright: '© OSM Contributors',
});

const layerImages = {
  'osm.baselayer': osmImage,
  'travic.baselayer': osmhotImage,
  'basedark.baselayer': openTopoImage,
};

<div className="rs-base-layer-example">
  <BasicMap
    map={map}
    center={center}
    zoom={6}
    layers={[layer1, layer2, layer3]}
    tabIndex={0}
  />
  <BaseLayerSwitcher
    layers={[layer1, layer2, layer3]}
    layerImages={layerImages}
  />
</div>;
```
