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

const mountLayerTree = (newData) => {
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
        renderItem: (item) => <div key={item.name}>{item.name}</div>,
      });
    });

    test('when classNames are used.', () => {
      renderLayerTree(data, { className: 'foo' });
    });

    test('when an item is hidden.', () => {
      renderLayerTree(data, {
        isItemHidden: (item) => !!item.children.length,
      });
    });

    test('when an item is hidden (different layer tree levels)', () => {
      renderLayerTree(data, {
        isItemHidden: (item) => item.isBaseLayer || item.get('hideInLegend'),
      });
    });

    test('when an item use renderBeforeItem.', () => {
      renderLayerTree(data, {
        renderBeforeItem: (layer) => (
          <div>Render name before item: {layer.name}</div>
        ),
      });
    });

    test('when an item use renderAfterItem.', () => {
      renderLayerTree(data, {
        renderAfterItem: (layer) => (
          <div>Render name after item: {layer.name}</div>
        ),
      });
    });

    test('when items are always expanded', () => {
      const dataExp = [
        {
          name: 'Expanded layer 1 (because of level 1)',
          visible: true,
          children: [
            {
              name: 'Expanded layer 1.1 (because of isAlwaysExpanded=true)',
              visible: true,
              properties: {
                isAlwaysExpanded: true,
              },
              children: [
                {
                  name:
                    'Expanded layer 1.1.1 (because of isAlwaysExpanded=true)',
                  visible: true,
                  properties: {
                    isAlwaysExpanded: true,
                  },
                  children: [
                    {
                      name: 'Visible layer 1.1.1.1 (as parent is expanded)',
                      visible: true,
                    },
                  ],
                },
                {
                  name: 'Hidden layer 1.1.1 (because of hidden=true)',
                  visible: true,
                  properties: {
                    hideInLegend: true,
                  },
                  children: [
                    {
                      name: 'Invisible layer 1.1.1.1 (as parent is hidden)',
                      visible: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'Expanded layer 1.2 (because of isAlwaysExpanded=true)',
              visible: true,
              properties: {
                isAlwaysExpanded: true,
              },
              children: [
                {
                  name: 'Visible layer 1.2.1 (as parent is expanded)',
                  visible: true,
                  children: [
                    {
                      name:
                        'Invisible layer 1.2.1.1 (as parent isAlwaysExpanded=false)',
                      visible: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'Expanded layer 2 (because of level 1)',
          visible: true,
          children: [
            {
              name: 'Visible layer 2.1 (as parent is expanded)',
              visible: true,
              children: [
                {
                  name:
                    'Invisible layer 2.1.1 (as parent isAlwaysExpanded=false)',
                  visible: true,
                  properties: {
                    isAlwaysExpanded: true,
                  },
                  children: [
                    {
                      name:
                        'Invisible layer 2.1.1.1 (as parent is not visible)',
                      visible: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'Visible layer 2.2 (as parent is expanded)',
              visible: true,
              children: [
                {
                  name:
                    'Invisible layer 2.2.1 (as parent isAlwaysExpanded=false)',
                  visible: true,
                  children: [
                    {
                      name:
                        'Invisible layer 2.2.1.1 (as parent is not visible)',
                      visible: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      renderLayerTree(dataExp, {
        isItemHidden: (item) => item.get('hideInLegend'),
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
      expect(spy.mock.calls[0][0].name).toBe('foo');
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
      wrapper.find('label').at(0).simulate('keypress', { which: 13 });
      expectCalled();
    });

    test('when we click on input.', () => {
      wrapper.find('input').at(0).simulate('click');
      expectCalled();
    });

    test('when we click on toggle button (label+arrow) of an item without children.', () => {
      wrapper.find(classItem).first().childAt(1).simulate('click');
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
      wrapper.find(toggleItem).first().simulate('click');
      expectCalled();
    });
  });
});
