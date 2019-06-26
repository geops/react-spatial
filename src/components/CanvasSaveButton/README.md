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

const defaultIconStyle = new Style({
  image: new Icon({
    src: 'images/marker.png',
    scale: 0.5,
  }),
});

const defaultTextStyle = new Style({
  text: new Text({
    font: '16px arial',
    text: 'My custom text',
    fill: new Fill({
      color: [255, 0, 0],
    }),
    stroke: new Stroke({
      color: [255, 255, 255],
      width: 3,
    }),
    scale: 1.5,
    rotation: 0.5,
  }),
});

const defaultLineStyle = new Style({
  stroke: new Stroke({
    color: 'red',
    lineDash: [10, 10],
    width: 3,
  }),
});
const text = new Feature(new Point([-8000000, 3000000]));
text.setStyle(defaultTextStyle.clone());

const icon = new Feature(new Point([8000000, 3000000]));
icon.setStyle(defaultIconStyle.clone());

const line = new Feature(new LineString([
  [-8000000, 3000000], [8000000, 3000000],
]));
line.setStyle(defaultLineStyle.clone());

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [text, icon, line],
  }),
});

const layerService = new LayerService([...layers, vectorLayer]);

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
