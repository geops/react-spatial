#

This demonstrates the use of Popup.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
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
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';

class PopupExample extends React.Component {
  constructor(props) {
    super(props);

    const extent = [599500, 199309, 600714, 200002];
    const resolutions = [
      6.927661,
      3.4638305,
      1.73191525,
      0.865957625,
      0.4329788125,
      0.21648940625,
      0.108244703125,
    ];

    const layer = new Layer({
      name: 'Layer',
      olLayer: new TileLayer({
        extent,
        source: new TileImageSource({
          tileUrlFunction: c =>
            '//plans.trafimage.ch/static/tiles/' +
            `bern_aussenplan/${c[0]}/${c[1]}/${c[2]}.png`,
          tileGrid: new TileGrid({
            origin: [extent[0], extent[1]],
            resolutions,
          }),
        }),
      }),
    });
    const vectorLayer = new VectorLayer({
      name: 'Popup layer',
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Point(getCenter(extent)),
          }),
        ],
      }),
      style: new Style({
        image: new Circle({
          radius: 40,
          fill: new Fill({
            color: '#ff0000',
          }),
        }),
      }),
    });
    this.center = getCenter(extent);
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
      <div className="tm-popup-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={17}
          layers={this.layers}
          onFeaturesClick={this.onFeaturesClick}
        />
        <ResizeHandler observe={this} />
        <Popup
          map={this.map}
          feature={featureClicked}
          onCloseClick={this.onCloseClick}
        >
          <div>Geometry:</div>
          <div>{content}</div>
        </Popup>
      </div>
    );
  }
}

<PopupExample />;
```
