#

This demonstrates the use of FeatureStyler.

```jsx
import React,  { useState } from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import Layer from 'react-spatial/Layer';
import { Vector as VectorLayer } from 'ol/layer';
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


const defaultIconStyle = new Style({
  image: new Icon({
    src: 'images/marker.png',
    scale: 0.5,
    imgSize: [48, 48], // ie 11
  }),
});

const defaultTextStyle = new Style({
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

const defaultLineStyle = new Style({
  stroke: new Stroke({
    color: 'red',
    lineDash: [10, 10],
    width: 3,
  }),
});

// Draw labels
const drawCustomsOptions = [
  {
    style: defaultTextStyle.clone(),
    image: AddTextIcon,
    onDrawEnd: evt => {
      evt.feature.setStyle(defaultTextStyle.clone());
    },
  },
];

// Draw icons
const drawIconOptions = {
  style: defaultIconStyle.clone(),
  onDrawEnd: evt => {
    evt.feature.setStyle(defaultIconStyle.clone());
  },
};

// Draw dashed line
const drawLineOptions = {
  style: defaultLineStyle.clone(),
  onDrawEnd: evt => {
    evt.feature.setStyle(defaultLineStyle.clone());
  },
};

const text = new Feature(new Point([-8000000, 3000000]));
text.setStyle(defaultTextStyle.clone());

const icon = new Feature(new Point([8000000, 3000000]));
icon.setStyle(defaultIconStyle.clone());

const line = new Feature(new LineString([
  [-8000000, 3000000], [8000000, 3000000],
]));
line.setStyle(defaultLineStyle.clone());

const map = new OLMap();

const layers = [
  new Layer({
    name: 'OSM layer',
    olLayer: new TileLayer({
      source: new OSM(),
    }),
  }),
  new Layer({
    name: 'Sample layer',
    olLayer: new VectorLayer({
      source: new VectorSource({
        features: [text, icon, line],
      }),
    }),
  }),
];

function FeatureStylerExample() {
  const [selectedFeature, setSelectedFeature] = useState();

  // Modification of feature Style is only allowed if a feature has a style.
  let featureStyler = null
  if (selectedFeature && selectedFeature.getStyleFunction()) {
    featureStyler = (
      <div className="tm-feature-styler-popup">
        <FeatureStyler feature={selectedFeature} />
      </div>
    );
  }

  return (
    <div className="tm-feature-styler-example">
      <BasicMap map={map} layers={layers} />
      <OLE
        map={map}
        drawPoint={drawIconOptions}
        drawLineString={drawLineOptions}
        drawCustoms={drawCustomsOptions}
        layer={layers[1]}
        onSelect={(f) => setSelectedFeature(f)}
        onDeselect={() => setSelectedFeature(null)}
      />
      {featureStyler}
    </div>
  );
}

<FeatureStylerExample />;
```
