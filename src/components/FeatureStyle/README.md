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
import Button from 'react-spatial/components/Button';
import 'ol/ol.css';
import './FeatureStyle.md.scss';

class FeatureStyleExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: null
    };
    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
    this.cancel = this.cancel.bind(this);

    this.map = new OLMap();

    const feat = new Feature(new Point(map.getView().getCenter()));
    feat.setStyle(new Style({
      image: new Icon({
        src: 'images/marker.png'
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

  componentDidUpdate(prevProps, prevState) {
    const { selectedFeature } = this.state

    if (selectedFeature && !prevState.selectedFeature){
      let style = selectedFeature.getStyle();
      style = 
        (style && Array.isArray(style))
          ? style.map(s => s.clone())
          : style.clone();
      this.oldStyle = style;
    }
  }

  select(feature) {
    this.setState({
      selectedFeature: feature
    });
  }

  cancel() {
    const { selectedFeature } = this.state;
    selectedFeature.setStyle(this.oldStyle);
    this.deselect();
  }

  deselect() {
    this.setState({
      selectedFeature: null
    });
  }

  renderFeatureStyle() {
    const { selectedFeature } = this.state
    if (!selectedFeature) {
      return null;
    }

    return (
      <div className="tm-feature-style-popup">
        <Button onClick={this.deselect}>X</Button>
        <FeatureStyle feature={selectedFeature} />
        <button onClick={this.cancel}>Cancel</button>
        <button onClick={this.deselect}>Save</button>
      </div>
    );
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
          onSelect={this.select}
          onDeselect={this.deselect}
        />
        {this.renderFeatureStyle()}
      </div>
    );
  }
}

<FeatureStyleExample />;
```
