#

This demonstrates the use of BaseLayerToggler.

```jsx
import React from 'react';
import OLMap from 'ol/Map';
import BaseLayerToggler from 'react-spatial/components/maps/BaseLayerToggler';
import BasicMap from 'react-spatial/components/maps/BasicMap';
import LayerService from 'react-spatial/LayerService';
import ConfigReader from 'react-spatial/ConfigReader';

const center = [1149722.7037660484, 6618091.313553318];
const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);
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