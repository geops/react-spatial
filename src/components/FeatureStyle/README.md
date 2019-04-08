#

This demonstrates the use of FeatureStyle.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import Layer from 'react-spatial/Layer';
import VectorLayer from 'react-spatial/VectorLayer';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import Select from 'ol/interaction/Select';
import { Style, Fill, Icon, Text, Stroke } from 'ol/style';
import OLE from 'react-spatial/components/OLE';
import OSM from 'ol/source/OSM';
import FeatureStyle from 'react-spatial/components/FeatureStyle';
import Button from 'react-spatial/components/Button';
import AddTextIcon from 'react-spatial/images/text.png';
import 'ol/ol.css';
import 'react-spatial/components/FeatureStyle/FeatureStyle.md.scss';

class ComplexFeatureStyleExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: null
    };
    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
    this.cancel = this.cancel.bind(this);
    this.forceDeselect = this.forceDeselect.bind(this);

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
          color:[255,255,255],
          width: 3
        }),
        scale: 1.5,
        rotation: 0.5
      }),
    });

    this.defaultLineStyle =  new Style({
      stroke: new Stroke({
        color: 'red',
        lineDash: [10,10],
        width: 3
      }),
    });

    // Draw labels
    this.drawCustomsOptions = [{
      style: this.defaultTextStyle.clone(),
      image: AddTextIcon,
      onDrawEnd: (evt)=> {
        evt.feature.setStyle(this.defaultTextStyle.clone());
      }},{
      style: this.defaultLineStyle.clone(),
      type: 'LineString',
      image: AddTextIcon,
      onDrawEnd: (evt)=> {
        evt.feature.setStyle(this.defaultLineStyle.clone());
      }}
    ];

    // Draw icons
    this.drawIconOptions = {
      style: this.defaultIconStyle.clone(),
      onDrawEnd: evt => {
        evt.feature.setStyle(this.defaultIconStyle.clone());
      }
    };

    // Draw dashed line
    this.drawLineOptions = {
      style: this.defaultLineStyle.clone()
    };


    // Label feature with a custom style  
    const feat = new Feature(new Point(this.map.getView().getCenter()));
    feat.setStyle([new Style({
      text: new Text({
        text: 'My text'
      }),
    })]);

    // Icon feature with a custom style 
    const feat2 = new Feature(new Point([2000000, 8000000]));
    feat2.setStyle(new Style({
      image: new Icon({
        src: 'images/favicon.png',
        scale: 3
      }),
    }));

    // Label feature with a style created by FeatureStyle.
    // Values must be selected in the form.
    const feat3 = new Feature(new Point([-8000000, 3000000]));
    feat3.setStyle(this.defaultTextStyle);

    // Icon feature with a style created by FeatureStyle.
    // Values must be selected in the form.
    const feat4 = new Feature(new Point([8000000, 3000000]));
    feat4.setStyle(this.defaultIconStyle);

    // Icon feature with a style created by FeatureStyle.
    // Values must be selected in the form.
    const feat5 = new Feature(new Point([8000000, 3000000]));
    feat5.setStyle(this.defaultLineStyle);

    this.layers = [
      new Layer({
        olLayer: new TileLayer({
          source: new OSM(),
        })
      }),
      new VectorLayer({
        source: new VectorSource({
          features: [feat, feat2, feat3, feat4, feat5]
        }),
        style: this.defaultLineStyle.clone()
      })
    ];
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedFeature } = this.state

    if (selectedFeature && !prevState.selectedFeature){
      let style = selectedFeature.getStyle();
      style =style && (Array.isArray(style)
          ? style.map(s => s.clone())
          : style.clone());
      this.oldStyle = style;
      this.oldGeometry = selectedFeature.getGeometry().clone();
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
    selectedFeature.setGeometry(this.oldGeometry);
    this.forceDeselect();
  }

  deselect() {
    this.setState({
      selectedFeature: null
    });
  }

  forceDeselect() {
    const { selectedFeature } = this.state;

    // we remove the feature from the select interaction
    const interaction = this.map
      .getInteractions()
      .getArray()
      .find(
        int =>
          int instanceof Select &&
          int.getActive() &&
          int.getFeatures().getArray().includes(selectedFeature),
      );
    if (interaction) {
      interaction.getFeatures().remove(selectedFeature);
    }
  }

  renderFeatureStyle() {
    const { selectedFeature } = this.state

    // Modification of feature Style is only allowed if a feature has a style.
    if (!selectedFeature || !selectedFeature.getStyleFunction()) {
      return null;
    }

    return (
      <div className="tm-feature-style-popup">
        <Button onClick={this.forceDeselect}>X</Button>
        <FeatureStyle feature={selectedFeature}/>
        <Button onClick={this.cancel}>Cancel</Button>
        <Button onClick={this.deselect}>Save</Button>
      </div>
    );
  }

  render() {
    return (
      <div className="tm-feature-style-example">
        <BasicMap
          map={this.map}
          layers={this.layers}
        />
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
        {this.renderFeatureStyle()}
      </div>
    );
  }
}

<ComplexFeatureStyleExample />;
```
