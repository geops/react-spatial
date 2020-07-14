#

This demonstrates the use of Popup.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import Popup from 'react-spatial/components/Popup';
import ResizeHandler from 'react-spatial/components/ResizeHandler';
import { Layer } from 'mobility-toolbox-js/ol/';
import { Vector as VectorLayer } from 'ol/layer';
import OLMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import OSM from 'ol/source/OSM';
import { getCenter } from 'ol/extent';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';

class PopupExample extends React.Component {
  constructor(props) {
    super(props);

    const layer = new Layer({
      name: 'Layer',
      olLayer: new TileLayer({
        source: new OSM(),
      })
    });

    const vectorLayer = new Layer({
      name: 'Popup layer',
      olLayer: new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point([874105.13, 6106172.77]),
            }),
            new Feature({
              geometry: new Point([873105.13, 6106172.77]),
            }),
          ],
        }),
        style: new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            imgSize: [32, 48]
          }),
        }),
      }),
    });
    this.center = [874105.13, 6106172.77];
    this.layers = [layer, vectorLayer];
    this.map = new OLMap();
    this.onFeaturesClick = this.onFeaturesClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);

    this.state = {
      featureClicked: null,
    };
  }

  onFeaturesClick(features) {
    this.setState({
      featureClicked: features.length ? features[0] : null,
    });
  }

  onCloseClick() {
    this.setState({ featureClicked: null });
  }

  render() {
    const { featureClicked } = this.state;
    const content =
      featureClicked &&
      featureClicked
        .getGeometry()
        .getCoordinates()
        .toString();

    return (
      <div className="rs-popup-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={17}
          layers={this.layers}
          onFeaturesClick={this.onFeaturesClick}
          tabIndex={0}
        />
        <ResizeHandler observe={this} />
        <Popup
          map={this.map}
          header="Geometry"
          feature={featureClicked}
          onCloseClick={this.onCloseClick}
          panIntoView
        >
          <div>{content}</div>
        </Popup>
      </div>
    );
  }
}

<PopupExample />;
```
