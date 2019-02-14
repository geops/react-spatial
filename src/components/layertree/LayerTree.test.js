import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LayerTree from './LayerTree';
import data, { applyDefaultValues } from '../../../data/TreeData.1';

configure({ adapter: new Adapter() });

describe('LayerTree', () => {
  let mutations;
  beforeEach(() => {
    mutations = [];
  });

  const mountLayerTree = data2 =>
    mount(
      <LayerTree
        tree={applyDefaultValues(data2)}
        onItemChange={(item, tree) => {
          mutations.push({ item, tree });
        }}
      />,
    );

  test('matches snapshots', () => {
    // Test-renderer cannot be use because of th DnD functionnality which needs an existing Html element
    const component = mount(<LayerTree tree={data} />);
    expect(component.html()).toMatchSnapshot();
  });

  describe('when an checkbox item is checked', () => {
    test('check all children', () => {
      const data2 = {
        rootId: 'root',
        items: {
          root: {
            children: ['1', '2'],
          },
          '1': {
            children: ['1-1', '1-2'],
          },
          '2': {},
          '1-1': {},
          '1-2': {
            children: ['1-2-1'],
          },
          '1-2-1': {},
        },
      };
      const component = mountLayerTree(data2);
      component
        .find('input')
        .first()
        .simulate('click', { target: { checked: true } });
      expect(mutations.length).toBe(5);
      const lastItems = mutations.pop().tree.items;
      ['1', '1-1', '1-2', '1-2-1'].forEach(id => {
        expect(lastItems[id].isChecked).toBe(true);
      });
      ['2'].forEach(id => {
        expect(lastItems[id].isChecked).toBe(false);
      });
    });

    describe('when siblings are uncheck', () => {
      test('check all parents', () => {
        const data2 = {
          rootId: 'root',
          items: {
            root: {
              children: ['1', '2'],
            },
            '1': {
              isExpanded: true,
              children: ['1-1', '1-2'],
            },
            '2': {},
            '1-1': {},
            '1-2': {
              isExpanded: true,
              children: ['1-2-1', '1-2-2'],
            },
            '1-2-1': {},
            '1-2-2': {},
          },
        };
        const component = mountLayerTree(data2);
        component
          .find('input')
          .at(4) // 1-2-1
          .simulate('click', { target: { checked: true } });
        expect(mutations.length).toBe(4);
        const lastItems = mutations.pop().tree.items;
        ['root', '1', '1-2', '1-2-2'].forEach(id => {
          expect(lastItems[id].isChecked).toBe(true);
        });
        ['2', '1-1', '1-2-1'].forEach(id => {
          expect(lastItems[id].isChecked).toBe(false);
        });
      });
    });
  });

  describe('when a radio item is checked', () => {
    test('expands the item, uncheck and collapse all the siblings, and apply defaults velue to the children.', () => {
      const data2 = {
        rootId: 'root',
        items: {
          root: {
            children: ['1', '2', '3'],
          },
          '1': {
            type: 'radio',
            children: ['1-1', '1-2'],
          },
          '2': {},
          '3': {
            isChecked: true,
            isExpanded: true,
            type: 'radio',
          },
          '1-1': {
            defaults: {
              isChecked: true,
              isExpanded: true,
            },
          },
          '1-2': {
            children: ['1-2-1'],
          },
          '1-2-1': {},
        },
      };
      const component = mountLayerTree(data2);
      component
        .find('input')
        .first()
        .simulate('click', { target: { checked: true } });
      expect(mutations.length).toBe(3);
      const lastItems = mutations.pop().tree.items;
      ['1', '1-1'].forEach(id => {
        expect(lastItems[id].isChecked).toBe(true);
        expect(lastItems[id].isExpanded).toBe(true);
      });
      ['2', '3', '1-2', '1-2-1'].forEach(id => {
        expect(lastItems[id].isChecked).toBe(false);
        expect(lastItems[id].isExpanded).toBe(false);
      });
    });
  });

  describe('when an radio item is unchecked', () => {
    test('uncheck all children', () => {
      const data2 = {
        rootId: 'root',
        items: {
          root: {
            children: ['1', '2', '3'],
          },
          '1': {
            isChecked: true,
            isExpanded: true,
            type: 'radio',
            children: ['1-1', '1-2', '1-3'],
          },
          '1-1': {
            type: 'radio',
          },
          '1-2': {
            isExpanded: true,
            children: ['1-2-1'],
          },
          '1-2-1': {
            isChecked: true,
          },
          '1-3': {
            isChecked: true,
            isExpanded: true,
            type: 'radio',
          },
          '2': {},
          '3': {
            isChecked: false,
            isExpanded: false,
            type: 'radio',
          },
        },
      };
      const component = mountLayerTree(data2);
      component
        .find('input')
        .first()
        .simulate('click', { target: { checked: true } });
      expect(mutations.length).toBe(3);
      const lastItems = mutations.pop().tree.items;
      ['1', '1-1', '1-2', '1-3', '1-2-1', '2', '3'].forEach(id => {
        expect(lastItems[id].isChecked).toBe(false);
      });
    });

    describe('when siblings are uncheck', () => {
      test('uncheck all parents.', () => {
        const data2 = {
          rootId: 'root',
          items: {
            root: {
              type: 'radio',
              children: ['1', '2'],
            },
            '1': {
              type: 'radio',
              isChecked: true,
              isExpanded: true,
              children: ['1-1', '1-2'],
            },
            '1-1': {
              type: 'radio',
            },
            '1-2': {
              type: 'radio',
              isChecked: true,
              isExpanded: true,
              children: ['1-2-1', '1-2-2'],
            },
            '1-2-1': {},
            '1-2-2': {},
            '2': {},
          },
        };
        const component = mountLayerTree(data2);
        component
          .find('input')
          .at(2) // 1-2
          .simulate('click', { target: { checked: true } });
        expect(mutations.length).toBe(2);
        const lastItems = mutations.pop().tree.items;
        ['1', '1-2'].forEach(id => {
          expect(lastItems[id].isChecked).toBe(false);
        });
      });
    });
  });

  describe('when an checkbox item is unchecked', () => {
    test('uncheck all children', () => {
      const data2 = {
        rootId: 'root',
        items: {
          root: {
            isChecked: true,
            children: ['1', '2', '3'],
          },
          '1': {
            isChecked: true,
            isExpanded: true,
            children: ['1-1', '1-2', '1-3'],
          },
          '1-1': {
            type: 'radio',
          },
          '1-2': {
            isExpanded: true,
            children: ['1-2-1'],
          },
          '1-2-1': {
            isChecked: true,
          },
          '1-3': {
            isChecked: true,
            isExpanded: true,
            type: 'radio',
          },
          '2': {},
          '3': {
            isChecked: false,
            isExpanded: false,
            type: 'radio',
          },
        },
      };
      const component = mountLayerTree(data2);
      component
        .find('input')
        .first()
        .simulate('click', { target: { checked: false } });
      expect(mutations.length).toBe(4);
      const lastItems = mutations.pop().tree.items;
      ['root', '1', '1-2-1', '1-3'].forEach(id => {
        expect(lastItems[id].isChecked).toBe(false);
      });
    });

    describe('when siblings are uncheck', () => {
      test('uncheck all parents.', () => {
        const data2 = {
          rootId: 'root',
          items: {
            root: {
              children: ['1', '2'],
            },
            '1': {
              type: 'radio',
              isChecked: true,
              isExpanded: true,
              children: ['1-1', '1-2'],
            },
            '1-1': {
              type: 'radio',
            },
            '1-2': {
              isChecked: true,
              isExpanded: true,
              children: ['1-2-1', '1-2-2'],
            },
            '1-2-1': {},
            '1-2-2': {},
            '2': {},
          },
        };
        const component = mountLayerTree(data2);
        component
          .find('input')
          .at(2) // 1-2
          .simulate('click', { target: { checked: false } });
        expect(mutations.length).toBe(2);
        const lastItems = mutations.pop().tree.items;
        ['1', '1-2'].forEach(id => {
          expect(lastItems[id].isChecked).toBe(false);
        });
      });
    });
  });
});
