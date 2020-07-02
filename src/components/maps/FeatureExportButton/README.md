#

This demonstrates the use of FeatureExportButton.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/maps/BasicMap';
import { Layer } from 'mobility-toolbox-js/src/ol/';
import { Vector as VectorLayer } from 'ol/layer';
import OLMap from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import GPX from 'ol/format/GPX';
import OSM, {ATTRIBUTION} from 'ol/source/OSM.js';

import FeatureExportButton from 'react-spatial/components/maps/FeatureExportButton';

class FeatureExportButtonExample extends React.Component {
  constructor(props) {
    super(props);
    this.map = new OLMap();

    const featStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        imgSize: [32, 48]
      }),
    });

    this.layers = [
      new Layer({
        name: 'OSM layer',
        olLayer: new TileLayer({
          source: new OSM(),
        }),
      }),
      new Layer({
        name:  'ExportLayer',
        olLayer: new VectorLayer({
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
      }),
    ];

    // Need to assign a style to each Feature.
    this.layers[1].olLayer.getSource().forEachFeature(f => {
      f.setStyle(featStyle);
    });
  }

  render() {
    return (
      <div className="rs-feature-export-example">
        <BasicMap
          center={[843119.531243, 6111943.000197]}
          zoom={9}
          map={this.map}
          layers={this.layers}
          tabIndex={0}
        />
        <div>
          <FeatureExportButton layer={this.layers[1]}>
            Export as KML
          </FeatureExportButton>
          <FeatureExportButton
            format={GPX}
            layer={this.layers[1]}
          >
            Export as GPX
          </FeatureExportButton>
        </div>
      </div>
    );
  }
}

<FeatureExportButtonExample />;
```
