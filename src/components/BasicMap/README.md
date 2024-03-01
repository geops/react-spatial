
The following example demonstrates the use of BasicMap.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';

const layers = [
  new MaplibreLayer({
    url: `https://maps.geops.io/styles/travic_v2/style.json?key=${apiKey}`,
  })
];

<BasicMap layers={layers} tabIndex={0} />;
```
