#

This demonstrates the use of CanvasSaveButton.

```jsx
import React from 'react';
import { TiImage } from 'react-icons/ti';
import Map from 'ol/Map';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import NorthArrow from '../NorthArrow/NorthArrow';
import Feature from 'ol/Feature';

const map = new Map();
const layers = ConfigReader.readConfig(map, treeData);
const layerService = new LayerService([...layers]);

function CanvasSaveButtonExample() {
  return (
    <div className="tm-canvas-save-button-example">
      <BasicMap
        map={map}
        center={[874105.13, 6106172.77]}
        zoom={10}
      />
       <CanvasSaveButton
        title="Save the map as PNG"
        className="tm-round-grey-hover-primary tm-button"
        map={map}
        scale={1}
        extraData={{
          copyright: {
            text: () => {
              return "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceau";
            },
          },
          northArrow: {
            src: 'images/northArrow.png',
            rotation: () => {
              return NorthArrow.radToDeg(map.getView().getRotation());
            },
            circled: true,
          },
        }}
      >
        <TiImage focusable={false} />
      </CanvasSaveButton>
      <CanvasSaveButton
        title="Save the map as PNG"
        className="tm-round-grey-hover-primary tm-button"
        map={map}
        scale={2}
        extraData={{
          copyright: {
            text: () => {
              return "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceau";
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
      <CanvasSaveButton
        title="Save the map as PNG"
        className="tm-round-grey-hover-primary tm-button"
        map={map}
        scale={3}
        extraData={{
          copyright: {
            text: () => {
              return "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceau";
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
