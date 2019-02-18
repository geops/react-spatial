#

This demonstrates the use of LayerTree.

```jsx
const React = require('react');
const LayerTree = require('./LayerTree').default;
const BasicMap = require('../map/BasicMap').default;
const Layer = require('../../Layer').default;
const VectorLayer = require('../../VectorLayer').default;
const OLMap = require('ol/Map').default;
const Feature = require('ol/Feature').default;
const Point = require('ol/geom/Point').default;
const VectorSource = require('ol/source/Vector').default;
const TileLayer = require('ol/layer/Tile').default;
const TileGrid = require('ol/tilegrid/TileGrid').default;
const TileImageSource = require('ol/source/TileImage').default;
const getCenter = require('ol/extent').getCenter;
const Style = require('ol/style/Style').default;
const Circle = require('ol/style/Circle').default;
const Fill = require('ol/style/Fill').default;
const Text = require('ol/style/Text').default;
require('./LayerTree.md.scss');

class LayerTreeExample extends React.Component {
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
        extent: extent,
        source: new TileImageSource({
          tileUrlFunction: c =>
            '//plans.trafimage.ch/static/tiles/' +
            `bern_aussenplan/${c[0]}/${c[1]}/${c[2]}.png`,
          tileGrid: new TileGrid({
            origin: [extent[0], extent[1]],
            resolutions: resolutions,
          }),
        }),
      }),
    });
    const vectorLayer = new VectorLayer({
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

    this.state = {
      treeData: { ...treeData },
    };
  }

  applyStyle(item) {
    this.layers[1].olLayer.getStyle().setText(
      new Text({
        font: '20px sans-serif',
        text: 'Last item modified is : ' + item.data.title,
      }),
    );
    this.layers[1].olLayer.changed();
  }

  render() {
    const { featureClicked, treeData } = this.state;

    return (
      <div className="tm-container">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={17}
          layers={this.layers}
        />
        <LayerTree
          tree={treeData}
          onUpdate={newTreeData => {
            this.setState({
              treeData: newTreeData,
            });
          }}
          onItemChange={item => {
            this.applyStyle(item);
          }}
        />
      </div>
    );
  }
}

<LayerTreeExample />;
```
