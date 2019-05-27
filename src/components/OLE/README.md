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

    const fill = new Fill({
      color: 'rgba(255,90,79,0.7)',
    });
    const stroke = new Stroke({
      color: '#FF5A4F',
      width: 1.25,
    });
    const dfltSelectStyle = new Style({
      image: new Circle({
        fill,
        stroke,
        radius: 10,
      }),
      fill,
      stroke,
    });

    this.selectStyleFc = feat => {
      return [dfltSelectStyle];
    };
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
          selectStyle={this.selectStyleFc}
          modifyStyle={this.selectStyleFc}
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
