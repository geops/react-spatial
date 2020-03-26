#

This demonstrates the use of BasicMap.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import Copyright from 'react-spatial/components/Copyright';


const layers = ConfigReader.readConfig([
    {
      name: 'Basemap',
      visible: true,
      isBaseLayer: true,
      data: {
        type: 'mapbox',
        url: `https://maps.geops.io/styles/travic/style.json?key=5cc87b12d7c5370001c1d6555a58d7028c3f493a9232b617ba9aa400`,
      },
      tabIndex: 1
    },
  ]);
  const layerService = new LayerService(layers);

<>
<Copyright layerService={layerService} />
<BasicMap layers={layers} />;
</>
```
