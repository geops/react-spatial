#

This demonstrates the use of ShareMenu.

```jsx
import React from 'react';
import OLMap from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import LayerService from 'react-spatial/LayerService';

class ShareMenuExample extends React.Component {
  constructor(props) {
    super(props);
    this.map = new OLMap({ controls: [] });
    this.center = [-10997148, 4569099];

    const layers = ConfigReader.readConfig(
      this.map,
      treeData,
    );

    this.layerService = new LayerService(this.layers);
  }

  render() {
    return (
      <div className="tm-share-menu-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={3}
        />
        <ShareMenu url={window.location.href}>
          <CanvasSaveButton
            title="Karte als Bild speichern."
            className='tm-canvas-save-button tm-share-menu-icon'
            map={this.map}
            layerService={this.layerService}
          />
        </ShareMenu>

      </div>
    );
  }
}

<ShareMenuExample />;
```
