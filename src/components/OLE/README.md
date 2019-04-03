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
import OLE from 'react-spatial/components/OLE';
import OSM, {ATTRIBUTION} from 'ol/source/OSM.js';
import 'ol/ol.css';

class OLEExample extends React.Component {
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
        />
        <OLE
          map={this.map}
          layer={this.layers[1]}
          cad
          drawPoint
          drawLineString
          drawPolygon
          move
          rotate
          modify
          del
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
