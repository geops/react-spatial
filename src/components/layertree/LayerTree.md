#

This demonstrates the use of LayerTree.

```jsx
const React = require('react');
const LayerTree = require('./LayerTree').default;
const BasicMap = require('../map/BasicMap').default;
const VectorLayer = require('../../VectorLayer').default;
const LayerService = require('../../LayerService').default;
const OLMap = require('ol/Map').default;
const Feature = require('ol/Feature').default;
const Point = require('ol/geom/Point').default;
const VectorSource = require('ol/source/Vector').default;
const Style = require('ol/style/Style').default;
const Circle = require('ol/style/Circle').default;
const Fill = require('ol/style/Fill').default;
const Text = require('ol/style/Text').default;
require('./LayerTree.md.css');

class LayerTreeExample extends React.Component {
  constructor(props) {
    super(props);

    this.center = [-10997148, 4569099];
    this.map = new OLMap();
    this.onFeaturesClick = this.onFeaturesClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);

    this.state = {
      featureClicked: null,
    };

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Point(this.center),
          }),
        ],
      }),
      style: new Style({
        image: new Circle({
          radius: 1,
          fill: new Fill({
            color: '#FFFFFF',
          }),
        }),
      }),
    });
    this.layers = [vectorLayer];
  }

  componentDidMount() {
    this.layerService = new LayerService({
      map: this.map,
      layerData: treeData,
      dataStyle: dataStyle,
    });
  }

  applyStyle(item) {
    this.layers[0].olLayer.getStyle().setText(
      new Text({
        font: '20px sans-serif',
        text: 'Last item modified is : ' + item.data.title,
      }),
    );
    this.layers[0].olLayer.changed();
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
      <div className="tm-container">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={3}
          layers={this.layers}
          onFeaturesClick={this.onFeaturesClick}
        />
        <div> Open the console F12 to see the mutations of the tree.</div>
        <LayerTree
          tree={treeData}
          onItemChange={(item, tree) => {
            this.layerService.onItemChange(this.map, item);
            this.applyStyle(item);
          }}
        />
      </div>
    );
  }
}

<LayerTreeExample />;
```
