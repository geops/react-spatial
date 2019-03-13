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
import ShareMenu from 'react-spatial/components/ShareMenu';
import LayerTree from 'react-spatial/components/LayerTree';

class MenuExample extends React.Component {
  constructor(props) {
    super(props);

    const layerConf = [{
      name: 'OSM Baselayer',
      visible: true,
      data: {
        type: 'xyz',
        url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    }];

    this.map = new OLMap();
    this.layers = ConfigReader.readConfig(this.map, layerConf);
    this.layerService = new LayerService(this.layers);

  }

  render() {
    return (
      <div className="tm-menu-example">
        <BasicMap
          map={this.map}
          zoom={3}
          layers={this.layers}
        />
        <Menu>
          <MenuItem title="Share">
            <ShareMenu url={window.location.href}/>
          </MenuItem>
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
