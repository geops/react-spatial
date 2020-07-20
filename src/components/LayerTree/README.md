#

This demonstrates the use of LayerTree.

```jsx
import React from 'react';
import LayerTree from 'react-spatial/components/LayerTree';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import ConfigReader from 'react-spatial/ConfigReader';

const layers = ConfigReader.readConfig(treeData);
const layerService = new LayerService(layers);

<div className="rs-layer-tree-example">
  <BasicMap layers={layers} center={[-10997148, 4569099]} zoom={3} tabIndex={0} />
  <LayerTree layerService={layerService} />
</div>
```
