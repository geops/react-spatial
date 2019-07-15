#

This demonstrates the use of OLE.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import Layer from 'react-spatial/Layer';
import VectorLayer from 'react-spatial/VectorLayer';
import OLMap from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import { Style, Fill, Circle, Stroke } from 'ol/style';
import OLE from 'react-spatial/components/OLE';
import OSM, {ATTRIBUTION} from 'ol/source/OSM.js';

class OLEExample extends React.Component {
  constructor(props) {
    super(props);

    this.map = new OLMap();

    this.center = [836691, 6049861];

    this.layers = [
      new Layer({
        name: 'OSM layer',
        olLayer:new TileLayer({
          source: new OSM()
        })
      }),
      new VectorLayer({
        name: 'OLE layer',
        source: new VectorSource(),
      })
    ];
  }

  render() {
    return (
      <div className="tm-ole-example">
        <BasicMap
          map={this.map}
          layers={this.layers}
          center={this.center}
          zoom={6}
        />
        <OLE
          map={this.map}
          layer={this.layers[1]}
          cad
          draw
          drawLineString
          drawPolygon
          modify
          rotate
          buffer
          union
          intersection
          difference
        />
      </div>
    );
  }
}

<OLEExample />;
```
