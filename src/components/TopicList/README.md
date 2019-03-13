#

This demonstrates the use of TopicList.

```jsx
const React = require('react');
const LayerTree = require('../LayerTree/LayerTree').default;
const TopicList = require('./TopicList').default;
const BasicMap = require('../BasicMap/BasicMap').default;
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

class TopicListExample extends React.Component {
  constructor(props) {
    super(props);

    this.center = [-10997148, 4569099];
    this.map = new OLMap({controls:[]});
    this.state = {
      topics: topicData,
      layerService: null,
    }
  }

  componentDidMount() {
    const layers = ConfigReader.readConfig(
      this.map,
      ConfigReader.getVisibleTopic(topicData),
    );

    this.setState({
      layerService: new LayerService(layers),
    })
  }

  onTopicClick(topic) {
    const { topics, layerService } = this.state;
    layerService.layers.forEach(layer => layer.setVisible(false));

    topics.map(t => {
      t.visible = (t.id === topic.id);
      return t;
    });

    const layers = ConfigReader.readConfig(
      this.map,
      ConfigReader.getVisibleTopic(topics),
    );

    this.setState({
      layerService: new LayerService(layers),
    });
  }

  onTopicToggle(topic) {
    const { topics } = this.state;

    this.setState({
      topics: topics.map(t => {
        if (t.id === topic.id) {
          t.expanded = !topic.expanded;
        }
        return t;
      })
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
    const {layerService, topics} = this.state;

    const propsToLayerTree = {
      layerService,
    };

    return (
      <div className="tm-topic-list-example">
        <TopicList
          onTopicClick={(topic) => this.onTopicClick(topic)}
          onTopicToggle={(topic) => this.onTopicToggle(topic)}
          propsToLayerTree={propsToLayerTree}
          layerService={layerService}
          topics={topics}
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

<TopicListExample />;
```
