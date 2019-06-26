#

This demonstrates the use of CanvasSaveButton.

```jsx
import React from 'react';
import { TiImage } from 'react-icons/ti';
import OLMap from 'ol/Map';
import Layer from 'react-spatial/Layer';
import VectorLayer from 'react-spatial/VectorLayer';
import VectorSource from 'ol/source/Vector';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import NorthArrow from '../NorthArrow/NorthArrow';
import Feature from 'ol/Feature';
import { Point, LineString } from 'ol/geom';
import { Style, Fill, Icon, Text, Stroke } from 'ol/style';


const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(map, hdData);
const layerService = new LayerService([...layers]);

function CanvasSaveButtonExample() {
  return (
    <div className="tm-canvas-save-button-example">
      <BasicMap
        map={map}
        layers={layerService.getLayers()}
        zoom={1}
      />
      <CanvasSaveButton
        title="Save the map as PNG"
        className="tm-round-grey-hover-primary tm-button"
        map={map}
        layerService={layerService}
        scale={2}
        extraData={{
          copyright: {
            text: () => {
              return layerService.getCopyrights();
            },
          },
          northArrow: {
            rotation: () => {
              return NorthArrow.radToDeg(map.getView().getRotation());
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
