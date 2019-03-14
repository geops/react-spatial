#

This demonstrates the use of TopicList.

```jsx
import React from  'react';
import LayerTree from 'react-spatial/components/LayerTree';
import TopicList from 'react-spatial/components/TopicList';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

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
      t.expanded = true;
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
