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

function MousePositionExample() {
  return (
    <div className="rs-mouse-position-example">
      <BasicMap map={map} center={center} zoom={6} layers={layers} tabIndex={0} />
      <MousePosition
        map={map}
        projections={[
          {
            label: 'World Geodetic System 1984',
            value: 'EPSG:4326',
          },
          {
            label: 'Web mercator with custom output',
            value: 'EPSG:3857',
            format: coordinates => {
              const decimals = 4;
              const text = [];
              coordinates.forEach(input => {
                const coord =
                  Math.round(parseFloat(input) * 10 ** decimals) /
                  10 ** decimals;
                const parts = coord.toString().split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
                text.push(parts.join());
              });
              return `Coordinates: ${text.join(' ')}`;
            },
          },
        ]}
      />
    </div>
  );
}

<MousePositionExample />;
```
