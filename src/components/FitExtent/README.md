
The following example demonstrates the use of FitExtent.

```jsx
import React from 'react';
import { MapboxLayer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import { geopsTheme } from '@geops/geops-ui';
import { ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import FitExtent from 'react-spatial/components/FitExtent';
import BasicMap from 'react-spatial/components/BasicMap';

const extent = [-15380353.1391, 2230738.2886, -6496535.908, 6927029.2369];

const map = new Map({ controls: [] });

const layers = [
  new MapboxLayer({
    url: `https://maps.geops.io/styles/travic_v2/style.json?key=${apiKey}`,
  }),
];

<ThemeProvider theme={geopsTheme}>
  <BasicMap map={map} layers={layers} tabIndex={0} />
  <FitExtent map={map} extent={extent}>
    <Button>
      Fit to US
    </Button>
  </FitExtent>
</ThemeProvider>
```
