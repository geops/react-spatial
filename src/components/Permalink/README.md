#

This demonstrates the use of Permalink.

```jsx
import React from 'react'
import Permalink from 'react-spatial/components/Permalink';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import Button from 'react-spatial/components/Button';
import OLMap from 'ol/Map';
import ConfigReader from '../../ConfigReader';

class PermalinkExample extends React.Component {
  constructor(props) {
    super(props);
    this.map = new OLMap({ controls: [] });
    this.center = [-10997148, 4569099];
    this.zoom = 3;

    this.layers = ConfigReader.readConfig(treeData);
    this.layerService = new LayerService(this.layers);

    this.params = {
      mode: 'custom',
    };
  }

  toggleVisibility() {
    const lineLayer = this.layerService.getLayer('USA Population Density');
    lineLayer.setVisible(!lineLayer.getVisible())
  }

  render() {
    return (
      <div className="tm-permalink-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={this.zoom}
        />
        <Permalink
          layerService={this.layerService}
          map={this.map}
          params={this.params}
        />
        <div>
          <Button
            className="tm-button tm-permalink-button"
            onClick={() => this.toggleVisibility()}
          >
            Toggle population layer
          </Button>
        </div>
      </div>
    );
  }
}

<PermalinkExample />;
```
