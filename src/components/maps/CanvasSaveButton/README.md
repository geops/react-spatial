#

This demonstrates the use of CanvasSaveButton.

```jsx
import React from 'react';
import { TiImage } from 'react-icons/ti';
import Map from 'ol/Map';
import degrees from 'radians-degrees';
import CanvasSaveButton from 'react-spatial/components/maps/CanvasSaveButton';
import BasicMap from 'react-spatial/components/maps/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import NorthArrow from '../NorthArrow/NorthArrow';
import Feature from 'ol/Feature';

const map = new Map();
const layers = ConfigReader.readConfig(treeData);
const layerService = new LayerService([...layers]);

function CanvasSaveButtonExample() {
  return (
    <div className="rs-canvas-save-button-example">
      <BasicMap
        map={map}
        center={[874105.13, 6106172.77]}
        zoom={10}
        layers={layers}
        tabIndex={0}
      />
      <CanvasSaveButton
        map={map}
        extraData={{
          copyright: {
            text: () => {
              return layers[0].copyright;
            },
          },
          northArrow: {
            rotation: () => {
              return degrees(map.getView().getRotation());
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

<CanvasSaveButtonExample />;
```
