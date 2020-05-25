#

This demonstrates the use of BasicMap.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import TokenLayer from 'react-spatial/layers/TokenLayer';


const layers = ConfigReader.readConfig([{
  name: 'OSM Baselayer',
  visible: true,
  data: {
    type: 'xyz',
    url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
}]);
layers.push(new TokenLayer());
<BasicMap layers={layers} />;
```
