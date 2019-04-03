#

This demonstrates the use of FeatureExportButton.

```jsx
import React from  'react';
import BasicMap from 'react-spatial/components/BasicMap';
import Layer from 'react-spatial/Layer';
import VectorLayer from 'react-spatial/VectorLayer';
import OLMap from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import OSM, {ATTRIBUTION} from 'ol/source/OSM.js';

import FeatureExportButton from 'react-spatial/components/FeatureExportButton';

class FeatureExportButtonExample extends React.Component {
  constructor(props) {
    super(props);

    this.map = new OLMap();

    this.layers = [
      new Layer({
        olLayer:new TileLayer({
          source: new OSM()
        })
      }),
      new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point([0, 0]),
            }),
          ],
        }),
        style: new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: '#7109e8',
            }),
          }),
        }),
      })
    ];
  }

  render() {
    return (
      <div className="tm-feature-export-example">
        <BasicMap
          map={this.map}
          layers={this.layers}
        />
        <FeatureExportButton layer={this.layers[1]} />
      </div>
    )
  }
}

<FeatureExportButtonExample />;
```
