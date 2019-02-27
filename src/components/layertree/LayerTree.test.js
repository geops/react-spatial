import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import OLMap from 'ol/Map';
import renderer from 'react-test-renderer';
import LayerTree from './LayerTree';
import data from '../../../data/TreeData';
import ConfigReader from '../../ConfigReader';
import LayerService from '../../LayerService';

configure({ adapter: new Adapter() });

const mountLayerTree = newData => {
  const layers = ConfigReader.readConfig(new OLMap({}), newData);
  const layerService = new LayerService(layers);
  return mount(<LayerTree service={layerService} />);
};

const renderLayerTree = (newData, props) => {
  const layers = ConfigReader.readConfig(new OLMap({}), newData);
  const layerService = new LayerService(layers);
  const component = renderer.create(
    <LayerTree service={layerService} {...props || {}} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
};

const classItem = '.tm-layer-tree-item';

describe('LayerTree', () => {
  describe('matches snapshots', () => {
    test('using default properties.', () => {
      renderLayerTree(data);
    });

    test('when renderItem is used.', () => {
      renderLayerTree(data, {
        renderItem: item => <div key={item.getId()}>{item.title}</div>,
      });
    });

    test('when classNames are used.', () => {
      renderLayerTree(data, {
        className: 'foo',
        classNameItem: 'bar',
        classNameInput: 'qux',
        classNameToggle: 'quux',
        classNameArrow: 'ged',
      });
    });

    test('when an item is hidden.', () => {
      renderLayerTree(data, {
        isItemHidden: item => !!item.children.length,
      });
    });
  });

  describe('triggers onInputClick', () => {
    let wrapper;
    let spy;
    const data2 = {
      rootId: '1',
      items: {
        '1': {
          data: {
            type: 'xyz',
          },
        },
      },
    };
    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].getId()).toBe('1');
    };

    beforeEach(() => {
      spy = jest.spyOn(LayerTree, 'onInputClick');
      wrapper = mountLayerTree(data2);
    });

    afterEach(() => {
      spy.mockRestore();
    });

    test('when we press enter with keyboard on the barrierfree element.', () => {
      wrapper
        .find(classItem)
        .first()
        .childAt(0)
        .simulate('keypress', { which: 13 });
      expectCalled();
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
        .childAt(2)
        .simulate('click');
      expectCalled();
    });
  });

  describe('triggers onToggle', () => {
    let wrapper;
    let spy;
    const data2 = {
      rootId: '1',
      items: {
        '1': {
          children: ['1-1'],
          data: {
            isExpanded: true,
          },
        },
        '1-1': {
          children: ['1-1-1'],
          data: {
            isExpanded: true,
          },
        },
        '1-1-1': {
          data: {
            type: 'xyz',
          },
        },
      },
    };

    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].getId()).toBe('1-1');
    };

    beforeEach(() => {
      spy = jest.spyOn(LayerTree, 'onToggle');
      wrapper = mountLayerTree(data2);
    });

    test('when we click on toggle button (label+arrow, not on level 0) of an item with children.', () => {
      wrapper
        .find(classItem)
        .at(1)
        .childAt(1)
        .simulate('click');
      expectCalled();
    });
  });
});
