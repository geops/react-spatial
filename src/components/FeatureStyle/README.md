#

This demonstrates the use of FeatureStyle.

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
import {Style, Circle,Fill,Icon} from 'ol/style';
import OLE from 'react-spatial/components/OLE';
import OSM, {ATTRIBUTION} from 'ol/source/OSM';
import FeatureStyle from 'react-spatial/components/FeatureStyle';
import 'ol/ol.css';

class FeatureStyleExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: null
    };
    this.onSelect = this.onSelect.bind(this);

    this.map = new OLMap();

    const feat = new Feature(new Point(map.getView().getCenter()));
    feat.setStyle(new Style({
      image: new Icon({
        src: 'https://maps.trafimage.ch/static/app_trafimage/img/sbb/sbb-26.png'
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

  onSelect(feature) {
    this.setState({
      'selectedFeature': feature
    });
  }

  render() {
    const { selectedFeature } = this.state
    return (
      <div className="tm-feature-style-example">
        <BasicMap
          map={this.map}
          layers={this.layers}
        />
        <OLE
          map={this.map}
          layer={this.layers[1]}
          onSelect={this.onSelect}
        />
        <FeatureStyle feature={selectedFeature} />
      </div>
    );
  }
}

<FeatureStyleExample />;
```
