#

This demonstrates the use of CanvasSaveButton.

```jsx
import React from 'react';
import { TiImage } from 'react-icons/ti';
import OLMap from 'ol/Map';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import Copyright from '../Copyright/Copyright';
import NorthArrow from '../NorthArrow/NorthArrow';

class CanvasSaveButtonExample extends React.Component {
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
    const extent = [-16681616.919511989, 655523.1517989757, -5312679.080488012, 8482674.848201025];

    return (
      <div className="tm-canvas-save-button-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={3}
        />
        <CanvasSaveButton
          title="Karte als Bild speichern."
          className="tm-round-grey-hover-primary tm-button"
          map={this.map}
          extent={extent}
          extraData={{
            copyright: {
              text: () => {
                return this.layerService.getCopyrights();
              },
            },
            northArrow: {
              rotation: () => {
                return NorthArrow.radToDeg(this.map.getView().getRotation());
              },
              circled: true,
            },
          }}
        >
          <TiImage focusable={false} />
        </CanvasSaveButton>
      </div>
    );
  }
}

<CanvasSaveButtonExample />;
```
