#

This demonstrates the use of LayerTree.

```jsx
import React from 'react';
import BaseLayerToggler from 'react-spatial/components/BaseLayerToggler';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

class BaseLayerTogglerExample extends React.Component {
  constructor(props) {
    super(props);

    this.center = [1149722.7037660484, 6618091.313553318];
    this.map = new OLMap({ controls: [] });

    this.state = {
      layerService: null
    }
  }

  componentDidMount() {
    const layers = ConfigReader.readConfig(
      this.map,
      treeData,
    );
    this.setState({
      layerService: new LayerService(layers)
    })
  }

  render() {
    const {layerService} = this.state;
    return (
      <div className="tm-base-layer-example">
        <BasicMap
          map={this.map}
          center={this.center}
          layers={this.layers}
          zoom={6}
        />
        <BaseLayerToggler
          map={this.map}
          layerService={layerService}
        />
      </div>
    );
  }
}

<BaseLayerTogglerExample />;
```
