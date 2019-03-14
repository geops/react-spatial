import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import OLMap from 'ol/Map';
import renderer from 'react-test-renderer';
import TopicList from './TopicList';
import topicData from '../../../data/TopicData';
import ConfigReader from '../../ConfigReader';
import LayerService from '../../LayerService';

configure({ adapter: new Adapter() });

const mountTopicList = (topics, props) => {
  const layers = ConfigReader.readConfig(new OLMap({}), topics);
  const layerService = new LayerService(layers);
  return mount(
    <TopicList
      topics={topics}
      propsToLayerTree={{ layerService }}
      {...props || {}}
    />,
  );
};

const renderTopicList = (topics, props) => {
  const layers = ConfigReader.readConfig(
    new OLMap({}),
    ConfigReader.getVisibleTopic(topics, 'children'),
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

const toggleItem = '.tm-topic-list-toggle';

describe('Topiclist', () => {
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
        className: 'mimi',
        classNameItem: 'mama',
        classNameInput: 'momo',
        classNameToggle: 'mumu',
        classNameArrow: 'meme',
      });
    });
  });

  describe('triggers onTopicClick', () => {
    let wrapper;
    let spy;
    let spy2;
    const topicsData = [
      {
        id: 'topic2',
        name: 'Topic 2',
        visible: true,
        expanded: false,
        children: [],
      },
    ];

    const funcs = {
      topicClick: () => {},
      topicToggle: () => {},
    };

    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
    };

    beforeEach(() => {
      wrapper = mountTopicList(topicsData, {
        onTopicClick: () => funcs.topicClick(),
      });
      spy = jest.spyOn(funcs, 'topicClick');
      spy2 = jest.spyOn(TopicList.prototype, 'onTopicToggle');
    });

    afterEach(() => {
      spy.mockRestore();
      spy2.mockRestore();
    });

    test('when we press enter with keyboard on the label element.', () => {
      wrapper
        .find('label')
        .at(0)
        .simulate('keypress', { which: 13 });
      expectCalled();
    });

    test('when we click on input.', () => {
      wrapper
        .find('input')
        .at(0)
        .simulate('click');
      expectCalled();
    });
  });

  describe('triggers onTopicToggle', () => {
    let wrapper;
    let spy;
    const topicsData = [
      {
        id: 'topic2',
        name: 'Topic 2',
        visible: true,
        expanded: true,
        children: [],
      },
    ];

    const funcs = {
      topicToggle: () => {},
    };

    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
    };

    beforeEach(() => {
      wrapper = mountTopicList(topicsData, {
        onTopicToggle: () => funcs.topicToggle(),
      });
      spy = jest.spyOn(TopicList.prototype, 'onTopicToggle');
    });

    afterEach(() => {
      spy.mockRestore();
    });

    test('when we click on toggle button (label+arrow) of a topic', () => {
      wrapper
        .find(toggleItem)
        .first()
        .simulate('click');
      expectCalled();
    });
  });
});
