#

This demonstrates the use of Menu.

```jsx
const React = require('react');
const BasicMap = require('../BasicMap/BasicMap').default;
const ConfigReader = require('../../ConfigReader').default;
const LayerService = require('../../LayerService').default;
const OLMap = require('ol/Map').default;
const Menu = require('../Menu/Menu').default;
const MenuItem = require('../MenuItem/MenuItem').default;

require('./Menu.md.css');

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

  }

  render() {
    return (
      <div className="tm-container">
        <Menu menuItems={[
          {
            title: 'Share',
            element: <MenuItem defaultMenuName="share" />,
          },
        ]} />
        <BasicMap
          map={this.map}
          zoom={3}
          layers={this.layers}
        />
      </div>
    );
  }
}

<MenuExample />;
```
