#

This demonstrates the use of FeatureStyler.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import Layer from 'react-spatial/Layer';
import VectorLayer from 'react-spatial/VectorLayer';
import OLMap from 'ol/Map';
import View from "ol/View";
import Feature from 'ol/Feature';
import { Point, LineString } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import Select from 'ol/interaction/Select';
import { Style, Fill, Icon, Text, Stroke } from 'ol/style';
import OSM from 'ol/source/OSM';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import FeatureStyler from 'react-spatial/components/FeatureStyler';
import OLE from 'react-spatial/components/OLE';
import Button from 'react-spatial/components/Button';
import AddTextIcon from 'react-spatial/images/text.png';
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";

class FeatureStylerExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFeature: null,
    };
    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);

    this.map = new OLMap({
      pixelRatio: 1,
    });

    this.mapHd = new OLMap({
    });


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

    const vec = new VectorLayer({
      source: new VectorSource({
        features: [text, icon, line],
      }),
    });

    const map = this.map;
    const mapHd = this.mapHd;
    var capabilitiesUrl = "https://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml";
    fetch(capabilitiesUrl)
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      var hiDPI = true;
      var layer = hiDPI ? "bmaphidpi" : "geolandbasemap";
      var tilePixelRatio = hiDPI ? 2 : 1;
      var result = new WMTSCapabilities().read(text);
      var options = optionsFromCapabilities(result, {
        layer:  layer,
        matrixSet: "google3857",
        style: "normal"
      });
      options.crossOrigin = "Anonymous";
      map.addLayer(
        new TileLayer({
          source: new WMTS(options)
        })
      );

      const optionsHd = options;
      optionsHd.tilePixelRatio = tilePixelRatio;
      mapHd.addLayer(
        new TileLayer({
          source: new WMTS(optionsHd)
        })
      );
    });

    const osmhd =  new Layer({
      olLayer: new TileLayer({
        source: new OSM({
          url: 'https://tile.osmand.net/hd/{z}/{x}/{y}.png'
        }),
      }),
    });
    this.layers = [vec];
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
      <>
        <div className="tm-feature-styler-example">
          <BasicMap map={this.map} layers={this.layers} center={[1823849, 6143760]} zoom={11}/>
          {this.renderFeatureStyler()}

          <CanvasSaveButton
            title="Karte als Bild speichern."
            map={this.map}
            extraData={{
            }}
          >
            <span>Export as png</span>
          </CanvasSaveButton>
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
        </div>
        <div className="tm-feature-styler-example">
          <BasicMap map={this.mapHd} layers={this.layers} center={[1823849, 6143760]} zoom={11}/>

          <CanvasSaveButton
            title="Karte als Bild speichern."
            map={this.mapHd}
            extraData={{
              dpi: 300
            }}
          >
            <span>Export as png</span>
          </CanvasSaveButton>
        </div>
      </>
    );
  }
}

<FeatureStylerExample />;
```
