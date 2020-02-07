#

This demonstrates the use of Geolocation.

```jsx
import OSM from "ol/source/OSM";
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import Geolocation from 'react-spatial/components/Geolocation';
import TileLayer from 'react-spatial/components/layer/Tile';

<BasicMap>
  <Geolocation />
  <TileLayer source={new OSM()} />
</BasicMap>;
```
