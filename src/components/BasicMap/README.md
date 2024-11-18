
The following example demonstrates the use of BasicMap.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';

const layers = [
  new MaplibreLayer({
    apiKey: apiKey,
  })
];

<BasicMap layers={layers} tabIndex={0} />;
```
