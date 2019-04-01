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
    this.map = new OLMap({ controls: [] });
    this.state = {
      topics: topicData,
      layerService: null,
    }
  }

  componentDidMount() {
    const layers = ConfigReader.readConfig(
      this.map,
      ConfigReader.getVisibleTopic(topicData).children,
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
      ConfigReader.getVisibleTopic(topics).children,
    );

    this.setState({
      layerService: new LayerService(layers),
    });
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
