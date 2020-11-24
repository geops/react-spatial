#

This demonstrates the use of BaseLayerSwitcher.

```jsx
import React from 'react';
import Map from 'ol/Map';
import BaseLayerSwitcher from 'react-spatial/components/BaseLayerSwitcher';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import osmImage from 'react-spatial/images/baselayer/osm.baselayer.png';
import osmhotImage from 'react-spatial/images/baselayer/osm.baselayer.hot.png';
import openTopoImage from 'react-spatial/images/baselayer/open.topo.map.png';

const center = [1149722.7037660484, 6618091.313553318];
const map = new Map({ controls: [] });
const layers = ConfigReader.readConfig(treeData);
const layerImages = {
  'osm.baselayer': osmImage,
  'osm.baselayer.hot': osmhotImage,
  'open.topo.map': openTopoImage,
};

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
