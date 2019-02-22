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
require('./LayerTree.md.scss');

class LayerTreeExample extends React.Component {
  constructor(props) {
    super(props);

    this.center = [-10997148, 4569099];
    this.map = new OLMap({controls:[]});

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

    this.state = {
      treeData: { ...treeData },
    };
  }

  componentDidMount() {
    this.layerService = new LayerService({
      map: this.map,
      treeData,
      dataStyle,
    });
  }

  applyStyle(itemId) {
    this.layers[0].olLayer.getStyle().setText(
      new Text({
        font: '20px sans-serif',
        text: 'Last item modified is : ' + itemId,
      }),
    );
    this.layers[0].olLayer.changed();
  }

  render() {
    const { featureClicked, treeData } = this.state;

    return (
      <div className="tm-layer-tree-example">
        <LayerTree
          tree={treeData}
          onItemToggle={(item) => {
            this.setState({
              treeData: this.layerService.onItemToggle(item),
            });
          }}
          onItemChange={(itemId) => {
            this.setState({
              treeData: this.layerService.onItemChange(itemId),
            });
            this.applyStyle(itemId);
          }}
        />
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={3}
          layers={this.layers}
        />
      </div>
    );
  }
}

<LayerTreeExample />;
```
