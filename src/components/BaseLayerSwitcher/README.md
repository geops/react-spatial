#

This demonstrates the use of BaseLayerSwitcher.

```jsx
import React from 'react';
import OLMap from 'ol/Map';
import BaseLayerSwitcher from 'react-spatial/components/BaseLayerSwitcher';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import ConfigReader from 'react-spatial/ConfigReader';

const center = [1149722.7037660484, 6618091.313553318];
const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData).filter(layer => layer.getIsBaseLayer());
const layerService = new LayerService(layers);

<div className="rs-base-layer-example">
  <BasicMap
    map={map}
    center={center}
    zoom={6}
    layers={layers}
  />
  <BaseLayerSwitcher
    layers={layers}
    layerService={layerService}
  />
</div>;
```
