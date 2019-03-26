#

This demonstrates the use of LayerTree.

```jsx
import React from  'react'
import LayerTree from 'react-spatial/components/LayerTree';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

class LayerTreeExample extends React.Component {
  constructor(props) {
    super(props);

    this.center = [-10997148, 4569099];
    this.map = new OLMap({controls:[]});

    const layers = ConfigReader.readConfig(
      this.map,
      treeData,
    );

    this.layerService = new LayerService(layers);
  }

  render() {
    return (
      <div className="tm-layer-tree-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={3}
        />
        <LayerTree
          layerService={this.layerService}
        />
      </div>
    );
  }
}

<LayerTreeExample />;
```
