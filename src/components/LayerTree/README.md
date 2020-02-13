#

This demonstrates the use of LayerTree.

```jsx
import React from 'react';
import OLMap from 'ol/Map';
import LayerTree from 'react-spatial/components/LayerTree';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import ConfigReader from 'react-spatial/ConfigReader';

const center = [-10997148, 4569099];
const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);
const layerService = new LayerService(layers);

function LayerTreeExample() {
  return (
    <div className="rs-layer-tree-example">
      <BasicMap map={map} layers={layers} center={center} zoom={3} />
      <LayerTree layerService={layerService} />
    </div>
  );
}

<LayerTreeExample />;
```
