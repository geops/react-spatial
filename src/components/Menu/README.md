#

This demonstrates the use of Menu.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import OLMap from 'ol/Map';
import Menu from 'react-spatial/components/Menu';
import MenuItem from 'react-spatial/components/MenuItem';
import ShareMenu from 'react-spatial/components/ShareMenu';
import LayerTree from 'react-spatial/components/LayerTree';

class MenuExample extends React.Component {
  constructor(props) {
    super(props);
    this.map = new OLMap({controls:[]});
    this.center = [-10997148, 4569099];

    this.layers = ConfigReader.readConfig(
      this.map,
      treeData,
    );
  }

  render() {
    return (
      <div className="tm-menu-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={3}
          layers={this.layers}
        />
        <Menu>
          <MenuItem title="Share">
            <ShareMenu url={window.location.href} />
          </MenuItem>
          <MenuItem title="Layers">
            <LayerTree layers={this.layers} />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

<MenuExample />;
```
