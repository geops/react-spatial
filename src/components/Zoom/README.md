#

This demonstrates the use of Zoom.

```jsx
import React from 'react';
import Zoom from 'react-spatial/components/Zoom';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

class BasicMapExample extends React.Component {
  constructor(props) {
    super(props);

    this.center = [1149722.7037660484, 6618091.313553318];
    this.map = new OLMap({ controls: [] });

    const layers = ConfigReader.readConfig(this.map, treeData);
    this.layerService = new LayerService(layers);
  }

  render() {
    return (
      <div className="tm-zoom-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={6}
        />
        <Zoom map={this.map} />
      </div>
    );
  }
}

<BasicMapExample />;
```
