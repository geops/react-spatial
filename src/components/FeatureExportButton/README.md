#

The following example demonstrates the use of FeatureExportButton.

```jsx
import React from 'react';
import { VectorLayer, MapboxLayer } from 'mobility-toolbox-js/ol';
import { Tile, Vector } from 'ol/layer';
import { Vector as VectorSource, OSM } from 'ol/source';
import { Feature }  from 'ol';
import {Point} from 'ol/geom';
import { Icon, Style } from 'ol/style';
import GPX from 'ol/format/GPX';
import BasicMap from 'react-spatial/components/BasicMap';
import FeatureExportButton from 'react-spatial/components/FeatureExportButton';


const vectorLayer = new VectorLayer({
  olLayer: new Vector({
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
    url: `https://maps.geops.io/styles/travic/style.json?key=${apiKey}`,
  }),
  vectorLayer,
];


<div className="rs-feature-export-example">
  <BasicMap
    center={[843119.531243, 6111943.000197]}
    zoom={9}
    layers={layers}
    tabIndex={0}
  />
  <div>
    <FeatureExportButton layer={vectorLayer}>
      Export as KML
    </FeatureExportButton>
    <FeatureExportButton
      format={GPX}
      layer={vectorLayer}
    >
      Export as GPX
    </FeatureExportButton>
  </div>
</div>
```
