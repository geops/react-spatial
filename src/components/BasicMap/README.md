
The following example demonstrates the use of BasicMap.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';
import {Map, View} from 'ol';

const layers = [
  new MaplibreLayer({
    apiKey: apiKey,
  })
];
const map = new Map({view: new View({center: [0, 0], zoom: 2})});

<BasicMap layers={layers} map={map} center={[810000, 5900000]} zoom={5.5} tabIndex={0} />;
```
