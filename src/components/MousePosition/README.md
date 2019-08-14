#

This demonstrates the use of MousePosition.

```jsx
import React from 'react';
import OLMap from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import MousePosition from 'react-spatial/components/MousePosition';

const center = [1149722.7037660484, 6618091.313553318];
const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);

function MousePositionExample(){
  return (
    <div className="tm-mouse-position-example">
      <BasicMap map={map} center={center} zoom={6} layers={layers} />
      <MousePosition map={map} projections={[
      {
        label: 'World Geodetic System 1984',
        value: 'EPSG:4326',
      },
      {
        label: 'Web mercator with custom output',
        value: 'EPSG:3857',
        format: (coord) => {
          const decimals = 4;
          let text = [];

          coord.forEach((input)=> {
              input = Math.round(parseFloat(input) * Math.pow(10, decimals)) /
                  Math.pow(10, decimals);
              input =input.toString();
              var parts = input.toString().split('.');
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
              text.push(parts.join());
          });
          return 'Coordinates: ' + text.join(' ');
        }
      },]}/>
    </div>
  )
}

<MousePositionExample />;
```
