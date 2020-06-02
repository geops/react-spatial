#

This demonstrates the use of BasicMap.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';


const layers = ConfigReader.readConfig([{
  name: 'OSM Baselayer',
  visible: true,
  data: {
    type: 'xyz',
    url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
}]);

<BasicMap layers={layers} tabIndex={0}/>;
```
