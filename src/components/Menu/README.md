#

This demonstrates the use of Menu.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import Menu from 'react-spatial/components/Menu';
import MenuItem from 'react-spatial/components/MenuItem';
import LayerTree from 'react-spatial/components/LayerTree';

class MenuExample extends React.Component {
  constructor(props) {
    super(props);
    this.map = new OLMap({ controls: [] });
    this.center = [-10997148, 4569099];

    const layers = ConfigReader.readConfig(treeData);
    this.layerService = new LayerService(layers);
  }

  render() {
    return (
      <div className="tm-menu-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={3}
        />
        <Menu>
          <MenuItem title="Layers">
            <LayerTree layerService={this.layerService} />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

<MenuExample />;
```
