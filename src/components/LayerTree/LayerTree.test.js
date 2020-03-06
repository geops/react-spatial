/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import renderer from 'react-test-renderer';
import LayerTree from './LayerTree';
import data from '../../../data/TreeData';
import ConfigReader from '../../ConfigReader';
import LayerService from '../../LayerService';

configure({ adapter: new Adapter() });

const mountLayerTree = newData => {
  const layers = ConfigReader.readConfig(newData);
  const layerService = new LayerService(layers);
  return mount(<LayerTree layerService={layerService} />);
};

const renderLayerTree = (newData, props) => {
  const layers = ConfigReader.readConfig(newData);
  const layerService = new LayerService(layers);
  const component = renderer.create(
    <LayerTree layerService={layerService} {...(props || {})} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
};

const classItem = '.rs-layer-tree-item';
const toggleItem = '.rs-layer-tree-toggle';

describe('LayerTree', () => {
  describe('matches snapshots', () => {
    test('using default properties.', () => {
      renderLayerTree(data);
    });

    test('when no layers.', () => {
      const layerService = new LayerService();
      const component = renderer.create(
        <LayerTree layerService={layerService} />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('when renderItem is used.', () => {
      renderLayerTree(data, {
        renderItem: item => <div key={item.getName()}>{item.getName()}</div>,
      });
    });

    test('when classNames are used.', () => {
      renderLayerTree(data, { className: 'foo' });
    });

    test('when an item is hidden.', () => {
      renderLayerTree(data, {
        isItemHidden: item => !!item.children.length,
      });
    });

    test('when an item is hidden (different layer tree levels)', () => {
      renderLayerTree(data, {
        isItemHidden: item => item.getIsBaseLayer() || item.get('hideInLegend'),
      });
    });
  });

  describe('triggers onInputClick', () => {
    let wrapper;
    let spy;
    let spy2;
    const data2 = [
      {
        name: 'foo',
        data: {
          type: 'xyz',
        },
      },
    ];
    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
      expect(spy.mock.calls[0][0].getName()).toBe('foo');
    };

    beforeEach(() => {
      spy = jest.spyOn(LayerTree.prototype, 'onInputClick');
      spy2 = jest.spyOn(LayerTree.prototype, 'onToggle');
      wrapper = mountLayerTree(data2);
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

    test('when we click on toggle button (label+arrow) of an item without children.', () => {
      wrapper
        .find(classItem)
        .first()
        .childAt(1)
        .simulate('click');
      expectCalled();
    });
  });

  describe('triggers onToggle', () => {
    let wrapper;
    let spy;
    const data2 = [
      {
        name: '1',
        children: [
          {
            name: '1-1',
          },
          {
            name: '1-1-1',
            data: {
              type: 'xyz',
            },
          },
        ],
      },
    ];

    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
    };

    beforeEach(() => {
      spy = jest.spyOn(LayerTree.prototype, 'onToggle');
      wrapper = mountLayerTree(data2);
    });

    test('when we click on toggle button (label+arrow) of an item with children', () => {
      wrapper
        .find(toggleItem)
        .first()
        .simulate('click');
      expectCalled();
    });
  });
});
