#

This demonstrates the use of BasicMap.

```jsx
import OSM from "ol/source/OSM";
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import TileLayer from 'react-spatial/components/layer/Tile';

<BasicMap>
  <TileLayer source={new OSM()} />
</BasicMap>;
```
