#

This demonstrates the use of BasicMap.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';


const layers = ConfigReader.readConfig([
    {
      name: 'Basemap',
      visible: true,
      isBaseLayer: true,
      data: {
        type: 'mapbox',
        url: `https://maps.geops.io/styles/trafimage_perimeter_v2/style.json`,
      },tabIndex:1,
      copyright: '© OpenStreetMap, OpenMapTiles, SBB/CFF/FFS, mapset.ch',
    },
  ]);

<BasicMap layers={layers} tabIndex/>;
```
