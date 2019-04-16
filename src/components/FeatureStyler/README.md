#

This demonstrates the use of FeatureStyler.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import Layer from 'react-spatial/Layer';
import VectorLayer from 'react-spatial/VectorLayer';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import { Point, LineString } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import Select from 'ol/interaction/Select';
import { Style, Fill, Icon, Text, Stroke } from 'ol/style';
import OLE from 'react-spatial/components/OLE';
import OSM from 'ol/source/OSM';
import FeatureStyler from 'react-spatial/components/FeatureStyler';
import Button from 'react-spatial/components/Button';
import AddTextIcon from 'react-spatial/images/text.png';

class FeatureStylerExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: null,
    };
    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);

    this.map = new OLMap();

    this.defaultIconStyle = new Style({
      image: new Icon({
        src: 'images/marker.png',
        scale: 0.5,
      }),
    });

    this.defaultTextStyle = new Style({
      text: new Text({
        font: '16px arial',
        text: 'My custom text',
        fill: new Fill({
          color: [255, 0, 0],
        }),
        stroke: new Stroke({
          color: [255, 255, 255],
          width: 3,
        }),
        scale: 1.5,
        rotation: 0.5,
      }),
    });

    this.defaultLineStyle = new Style({
      stroke: new Stroke({
        color: 'red',
        lineDash: [10, 10],
        width: 3,
      }),
    });

    // Draw labels
    this.drawCustomsOptions = [
      {
        style: this.defaultTextStyle.clone(),
        image: AddTextIcon,
        onDrawEnd: evt => {
          evt.feature.setStyle(this.defaultTextStyle.clone());
        },
      },
    ];

    // Draw icons
    this.drawIconOptions = {
      style: this.defaultIconStyle.clone(),
      onDrawEnd: evt => {
        evt.feature.setStyle(this.defaultIconStyle.clone());
      },
    };

    // Draw dashed line
    this.drawLineOptions = {
      style: this.defaultLineStyle.clone(),
      onDrawEnd: evt => {
        evt.feature.setStyle(this.defaultLineStyle.clone());
      },
    };

    const text = new Feature(new Point([-8000000, 3000000]));
    text.setStyle(this.defaultTextStyle.clone());

    const icon = new Feature(new Point([8000000, 3000000]));
    icon.setStyle(this.defaultIconStyle.clone());

    const line = new Feature(new LineString([
      [-8000000, 3000000], [8000000, 3000000],
    ]));
    line.setStyle(this.defaultLineStyle.clone());

    this.layers = [
      new Layer({
        olLayer: new TileLayer({
          source: new OSM(),
        }),
      }),
      new VectorLayer({
        source: new VectorSource({
          features: [text, icon, line],
        }),
      }),
    ];
  }

  select(feature) {
    this.setState({
      selectedFeature: feature,
    });
  }

  deselect() {
    this.setState({
      selectedFeature: null,
    });
  }

  renderFeatureStyler() {
    const { selectedFeature } = this.state;

    // Modification of feature Style is only allowed if a feature has a style.
    if (!selectedFeature || !selectedFeature.getStyleFunction()) {
      return null;
    }

    return (
      <div className="tm-feature-styler-popup">
        <FeatureStyler feature={selectedFeature} />
      </div>
    );
  }

  render() {
    return (
      <div className="tm-feature-styler-example">
        <BasicMap map={this.map} layers={this.layers} />
        <OLE
          map={this.map}
          drawPoint={this.drawIconOptions}
          drawLineString={this.drawLineOptions}
          drawCustoms={this.drawCustomsOptions}
          modify={this.modifyOptions}
          layer={this.layers[1]}
          onSelect={this.select}
          onDeselect={this.deselect}
        />
        {this.renderFeatureStyler()}
      </div>
    );
  }
}

<FeatureStylerExample />;
```
