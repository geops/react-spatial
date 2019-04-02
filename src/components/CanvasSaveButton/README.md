#

This demonstrates the use of CanvasSaveButton.

```jsx
import React from 'react';
import OLMap from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import ShareMenu from 'react-spatial/components/ShareMenu';
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

    this.layerService = new LayerService(layers);
  }

  render() {
    const extent = [-9794733.326747464, 4282425.233910811, -7588454.942324137, 5385564.4261224745];

    return (
      <div className="tm-canvas-save-button-example">
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
            extent={extent}
            northArrow
            rotationOffset={20}
            circled
          />
        </ShareMenu>

      </div>
    );
  }
}

<ShareMenuExample />;
```
