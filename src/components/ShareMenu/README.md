#

This demonstrates the use of ShareMenu.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from '../../ConfigReader';
import ShareMenu from 'react-spatial/components/ShareMenu';
import CanvasSaveButton from '../CanvasSaveButton';
import OLMap from 'ol/Map';

class ShareMenuExample extends React.Component {
   constructor(props) {
    super(props);
    this.map = new OLMap({ controls: [] });
    this.center = [-10997148, 4569099];

    const layers = ConfigReader.readConfig(
      this.map,
      treeData,
    );
  };

render() {
    return (
      <div className="tm-share-menu-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={3}
          layers={this.layers}
        />
        <ShareMenu url={window.location.href} >
          <CanvasSaveButton
            title="Karte als Bild speichern."
            className='tm-canvas-save-button tm-share-menu-icon'
            map={this.map}
          />
        </ShareMenu>

      </div>
    );
  }
}

<ShareMenuExample />;
```
