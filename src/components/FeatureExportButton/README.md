
The following example demonstrates the use of FeatureExportButton.

```jsx
import React from 'react';
import { Layer, MapboxLayer } from 'mobility-toolbox-js/ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import GPX from 'ol/format/GPX';
import { geopsTheme, Header, Footer } from '@geops/geops-ui';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import BasicMap from 'react-spatial/components/BasicMap';
import FeatureExportButton from 'react-spatial/components/FeatureExportButton';


const vectorLayer = new Layer({
  olLayer: new VectorLayer({
    style: new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        imgSize: [32, 48]
      })
    }),
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new Point([819103.972418, 6120013.078324]),
        }),
        new Feature({
          geometry: new Point([873838.856313, 6106009.575876]),
        }),
      ],
    }),
  }),
});

const layers = [
  new MapboxLayer({
    url: `https://maps.geops.io/styles/travic_v2/style.json?key=${apiKey}`,
  }),
  vectorLayer,
];

<ThemeProvider theme={geopsTheme}>
  <div className="rs-feature-export-example">
    <BasicMap
      center={[843119.531243, 6111943.000197]}
      zoom={9}
      layers={layers}
      tabIndex={0}
    />
    <div className="rs-feature-export-example-btns">
      <FeatureExportButton layer={vectorLayer}>
        <Button>
          Export as KML
        </Button>
      </FeatureExportButton>
      <FeatureExportButton
        format={GPX}
        layer={vectorLayer}
      >
        <Button>
          Export as GPX
        </Button>
      </FeatureExportButton>
    </div>
  </div>
</ThemeProvider>
```
