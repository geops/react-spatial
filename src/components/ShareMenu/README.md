#

This demonstrates the use of ShareMenu.

```jsx
import React from 'react';
import { TiImage } from 'react-icons/ti';
import OLMap from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import ShareMenu from 'react-spatial/components/ShareMenu';
import ConfigReader from 'react-spatial/ConfigReader';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';

class ShareMenuExample extends React.Component {
  constructor(props) {
    super(props);
    this.map = new OLMap({ controls: [] });
    this.center = [-10997148, 4569099];

    ConfigReader.readConfig(
      this.map,
      treeData,
    );
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
            className="tm-canvas-save-button tm-share-menu-icon"
            map={this.map}
          >
            <TiImage focusable={false} />
          </CanvasSaveButton>
        </ShareMenu>
      </div>
    );
  }
}

<ShareMenuExample />;
```
