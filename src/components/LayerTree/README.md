#

This demonstrates the use of LayerTree.

```jsx
import React from 'react'
import LayerTree from 'react-spatial/components/LayerTree';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

const center = [-10997148, 4569099];
const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(
  map,
  treeData,
);
const layerService = new LayerService(layers);

function LayerTreeExample() {
  return (
    <div className="tm-layer-tree-example">
      <BasicMap
        map={map}
        center={center}
        zoom={3}
        layers={layers}
      />
      <LayerTree
        layerService={layerService}
      />
    </div>
  );
}

<LayerTreeExample />;
```
