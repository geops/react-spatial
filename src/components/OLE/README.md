#

This demonstrates the use of OLE.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import Popup from 'react-spatial/components/Popup';
import ResizeHandler from 'react-spatial/components/ResizeHandler';
import Layer from 'react-spatial/Layer';
import VectorLayer from 'react-spatial/VectorLayer';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileImageSource from 'ol/source/TileImage';
import { getCenter } from 'ol/extent';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import OLE from 'react-spatial/components/OLE';
import OSM, {ATTRIBUTION} from 'ol/source/OSM.js';
import 'ol/ol.css';

class OLEExample extends React.Component {
  constructor(props) {
    super(props);

    this.map = new OLMap();

    const feat = new Feature(new Point(map.getView().getCenter()));
    feat.setStyle(new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: '#ff0000',
        }),
      }),
    }));

    this.layers = [
      new Layer({
        olLayer:new TileLayer({
          source: new OSM()
        })
      }),
      new VectorLayer({
        source: new VectorSource({
          features: [feat]
        }),
      })
    ];
  }

  render() {
    return (
      <div className="tm-ole-example">
        <BasicMap
          map={this.map}
          layers={this.layers}
        />
        <OLE
          map={this.map}
          layer={this.layers[1]}
        />
      </div>
    );
  }
}

<OLEExample />;
```
