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
const ConfigReader = require('../../ConfigReader').default;
require('./LayerTree.md.scss');

class LayerTreeExample extends React.Component {
  constructor(props) {
    super(props);

    this.center = [-10997148, 4569099];
    this.map = new OLMap({controls:[]});
    this.state = {
      layerService: null
    }
  }

  componentDidMount() {
    const layers = ConfigReader.readConfig(
      this.map,
      treeData.default,
    );
    this.setState({
      layerService: new LayerService(layers)
    })
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
    const {layerService} = this.state;
    return (
      <div className="tm-layer-tree-example">
        <LayerTree
          layerService={layerService}
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
