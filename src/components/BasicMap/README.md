#

This demonstrates the use of BasicMap.

```jsx
import React from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GML from 'ol/format/GML';
import { bbox } from 'ol/loadingstrategy';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import TokenLayer from 'react-spatial/layers/TokenLayer';


const layers = ConfigReader.readConfig([{
  name: 'OSM Baselayer',
  visible: true,
  data: {
    type: 'xyz',
    url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
}]);

layers.push(new TokenLayer({
  key:'tokenLayer',
  username: '',
  password: '',
  tokenUrl:'https://map.geo.fr.ch/arcgis/tokens/?request=gettoken',
  expiration: 1, // in minutes
  olLayer: new VectorLayer({
    source: new VectorSource({
      format: new GML(),
      loader(extent, resolution, projection) {
        if (!this.token) {
          return;
        }
        const proj = projection.getCode();
        const url = `https://map.geo.fr.ch/arcgis/services/SIPO/SIPO_Liegenschaften/MapServer/WFSServer?service=WFS&version=1.1.0&request=GetFeature&typename=RealEstate&srsname=${proj}&bbox=${extent.join(
          ',',
        )},${proj}&token=${(this && this.token) || ''}`;

        fetch(url)
          .then((response) => {
            return response.text();
          })
          .then((data) => {
            if (!data) {
              throw new Error('Empty data');
            }
            this.addFeatures(
              this.getFormat().readFeatures(data),
            );
          })
          .catch(() => {
            this.removeLoadedExtent(extent);
          });
      },
      strategy: bbox,
    }),
  }),
  onTokenUpdate: (token, layer) => {
    const source = layer.olLayer.getSource();
    source.token = token;
    source.refresh();
  },
}));

<BasicMap layers={layers} extent={[782540.2374443528, 5896333.64697159, 789429.4575714802, 5899261.077620511]} tabIndex={0}/>;
```
