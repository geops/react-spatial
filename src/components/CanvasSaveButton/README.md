The following example demonstrates the use of CanvasSaveButton.

```jsx
import React from 'react';
import { TiImage } from 'react-icons/ti';
import { geopsTheme } from '@geops/geops-ui';
import { ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import { toDegrees } from 'ol/math';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import BasicMap from 'react-spatial/components/BasicMap';
import geopsLogo from 'react-spatial/images/geops_logo.png';
import qrCode from 'react-spatial/images/geops_qr.png';

const map = new Map();

const layers = [
  new Tile({
    source: new OSM({
      attributions: '© layer-copyright',
    }),
  }),
];

<ThemeProvider theme={geopsTheme}>
  <div className="rs-canvas-save-button-example">
    <BasicMap
      map={map}
      layers={layers}
      center={[874105.13, 6106172.77]}
      zoom={10}
      tabIndex={0}
    />
    <CanvasSaveButton
      map={map}
      extraData={{
        copyright: {
          text: () => {
            return layers[0].getSource().getAttributions()();
          },
          background: true,
        },
        northArrow: {
          rotation: () => {
            return toDegrees(map.getView().getRotation());
          },
          circled: true,
        },
        logo: {
          src: geopsLogo,
          height: 22,
          width: 84,
        },
        qrCode: {
          src: qrCode,
          height: 50,
          width: 50,
        },
      }}
    >
      <Button>Export Map</Button>
    </CanvasSaveButton>
  </div>
</ThemeProvider>
```
