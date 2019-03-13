import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import OLMap from 'ol/Map';
import renderer from 'react-test-renderer';
import TopicList from './TopicList';
import topicData from '../../../data/TopicData';
import ConfigReader from '../../ConfigReader';
import LayerService from '../../LayerService';

configure({ adapter: new Adapter() });

const renderTopicList = (topics, props) => {
  const layers = ConfigReader.readConfig(
    new OLMap({}),
    ConfigReader.getVisibleTopic(topics),
  );
  const layerService = new LayerService(layers);
  const component = renderer.create(
    <TopicList
      topics={topics}
      propsToLayerTree={{ layerService }}
      {...props || {}}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
};

describe('LayerTree', () => {
  describe('matches snapshots', () => {
    test('using default properties.', () => {
      renderTopicList(topicData);
    });

    test('when no layers.', () => {
      const layerService = new LayerService();
      const component = renderer.create(
        <TopicList topics={topicData} propsToLayerTree={{ layerService }} />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('when classNames are used.', () => {
      renderTopicList(topicData, {
        className: 'foo',
        classNameItem: 'bar',
        classNameInput: 'qux',
        classNameToggle: 'quux',
        classNameArrow: 'ged',
      });
    });
  });
});
