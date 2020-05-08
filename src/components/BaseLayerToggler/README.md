#

This demonstrates the use of BaseLayerToggler.

```jsx
import React from 'react';
import OLMap from 'ol/Map';
import BaseLayerToggler from 'react-spatial/components/BaseLayerToggler';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import ConfigReader from 'react-spatial/ConfigReader';

const center = [1149722.7037660484, 6618091.313553318];
const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);
const layerService = new LayerService([]);

layerService.setLayers(layers);

setTimeout(() => {
  layerService.setLayers(layers);
}, 500);

setTimeout(() => {
  layerService.setLayers(layers);
}, 1000);

<div className="rs-base-layer-example">
  <BasicMap
    map={map}
    center={center}
    zoom={6}
    layers={layers}
  />
  <BaseLayerToggler
    map={map}
    layerService={layerService}
  />
</div>;
```
