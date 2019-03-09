import 'jest-canvas-mock';
import OLMap from 'ol/Map';
import LayerService from './LayerService';
// import treeData from '../data/TreeData.esm';
import ConfigReader from './ConfigReader';

describe('LayerService', () => {
  const instantiateLayerService = data => {
    const map = new OLMap();
    const layers = ConfigReader.readConfig(map, data);
    return new LayerService(layers);
  };

  const layerData = {
    '0': {
      name: 'root',
    },
    '1': {
      name: '1-1',
      children: [
        {
          name: '1-1',
          radioGroup: 'radio',
        },
        {
          name: '1-2',
          isChecked: true,
          isExpanded: true,
          radioGroup: 'radio',
          children: [{ name: '1-2-1' }, { name: '1-2-2' }, { name: '2' }],
        },
      ],
    },
  };

  test('should instantiate LayerService class correctly.', () => {
    const layerService = instantiateLayerService(layerData);
    expect(layerService.getLayersAsFlatArray().length).toBe(7);
  });

  test('should return the correct number of layers.', () => {
    const layerService = instantiateLayerService(layerData);
    expect(layerService.getLayers().length).toBe(2);
  });

  test('should return layers by name.', () => {
    const layerService = instantiateLayerService(layerData);
    expect(layerService.getLayer('root')).toBeDefined();
    expect(layerService.getLayer('1-2-2')).toBeDefined();
    expect(layerService.getLayer('1-2')).toBeDefined();
    expect(layerService.getLayer('42')).toBeUndefined();
  });

  test('should return the parent layer.', () => {
    const layerService = instantiateLayerService(layerData);
    const child = layerService.getLayer('1-2');
    expect(layerService.getParent(child).getName()).toBe('1-1');
  });

  test('should return radio layers.', () => {
    const layerService = instantiateLayerService(layerData);
    expect(layerService.getRadioGroupLayers('radio').length).toBe(2);
    expect(layerService.getRadioGroupLayers('no-radio').length).toBe(0);
  });

  /*
  describe('onItemChange', () => {
    describe('when an checkbox item is checked,', () => {
      test('check only this checkbox.', () => {
        const layerService = instantiateLayerService({
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
        });
        const spy = jest.spyOn(layerService, 'onItemChange');
        layerService.onItemChange('2');
        const updatedItems = layerService.treeData.items;

        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['2'].isChecked).toBe(true);
      });

      test('check all children.', () => {
        const layerService = instantiateLayerService({
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
        });
        // Enables counting the mutations.
        const spy = jest.spyOn(layerService, 'mutateTree');
        layerService.onItemChange('1');
        const updatedItems = layerService.treeData.items;

        expect(spy).toHaveBeenCalledTimes(5);
        ['1', '1-1', '1-2', '1-2-1'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(true);
        });
        expect(updatedItems['2'].isChecked).toBe(false);
      });

      describe('when siblings are uncheck,', () => {
        test('check all parents', () => {
          const layerService = instantiateLayerService({
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
          });
          const spy = jest.spyOn(layerService, 'mutateTree');
          layerService.onItemChange('1-2-1');
          const updatedItems = layerService.treeData.items;

          expect(spy).toHaveBeenCalledTimes(4);
          ['root', '1', '1-2', '1-2-1'].forEach(id => {
            expect(updatedItems[id].isChecked).toBe(true);
          });
          ['2', '1-1', '1-2-2'].forEach(id => {
            expect(updatedItems[id].isChecked).toBe(false);
          });
        });
      });
    });

    describe('when an radio item is checked', () => {
      test(`expands the item, uncheck and collapse all the radio siblings and
      their children, then apply defaults to the item's children.`, () => {
        const layerService = instantiateLayerService({
          rootId: 'root',
          items: {
            root: {
              children: ['1', '2', '3', '4'],
            },
            '1': {
              type: 'radio',
              children: ['1-1', '1-2', '1-3'],
              isExpanded: true,
            },
            '2': {},
            '3': {
              isChecked: true,
              isExpanded: true,
              type: 'radio',
              children: ['3-1', '3-2', '3-3'],
            },
            '4': {
              isChecked: true,
              isExpanded: true,
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
            '1-3': {
              defaults: {
                isChecked: true,
                isExpanded: true,
              },
            },
            '1-2-1': {},
            '3-1': {
              type: 'radio',
              isChecked: true,
            },
            '3-2': {
              type: 'radio',
              isChecked: false,
            },
            '3-3': {
              isChecked: true,
            },
          },
        });
        const spy = jest.spyOn(layerService, 'mutateTree');
        layerService.onItemChange('1');
        const updatedItems = layerService.treeData.items;

        expect(spy).toHaveBeenCalledTimes(6);
        ['1', '1-1', '1-3', '4'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(true);
          expect(updatedItems[id].isExpanded).toBe(true);
        });
        ['2', '3', '1-2', '1-2-1', '3-1', '3-2', '3-3'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(false);
          expect(updatedItems[id].isExpanded).toBe(false);
        });
      });
    });

    describe("when a radio item's child is checked", () => {
      test(`check its radio parent, collapse parent's sibling radio,
      uncheck parent's sibling radio and their children.`, () => {
        const layerService = instantiateLayerService({
          rootId: 'root',
          items: {
            root: {
              type: 'radio',
              name: 'root',
              children: ['1', '2', '3', '4'],
            },
            '1': {
              name: 'name1',
              type: 'radio',
              isChecked: false,
              isExpanded: true,
              children: ['1-1', '1-2', '1-3'],
            },
            '2': {},
            '3': {
              name: 'name3',
              isChecked: true,
              isExpanded: true,
              type: 'radio',
              children: ['3-1', '3-2', '3-3'],
            },
            '4': {
              isChecked: true,
              isExpanded: true,
            },
            '1-1': {
              name: 'name1-1',
            },
            '1-2': {
              type: 'radio',
            },
            '1-3': {
              type: 'radio',
            },
            '3-1': {
              type: 'radio',
              isChecked: true,
            },
            '3-2': {
              type: 'radio',
            },
            '3-3': {
              isChecked: true,
            },
          },
        });
        const spy = jest.spyOn(layerService, 'mutateTree');
        layerService.onItemChange('1-1');
        const updatedItems = layerService.treeData.items;

        expect(spy).toHaveBeenCalledTimes(5);
        ['1', '1-1', '4'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(true);
          expect(updatedItems[id].isExpanded).toBe(true);
        });
        ['1-2', '1-3', '2', '3', '3-1', '3-2', '3-3'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(false);
          expect(updatedItems[id].isExpanded).toBe(false);
        });
      });
    });

    describe('when an radio item is unchecked', () => {
      test('uncheck all children', () => {
        const layerService = instantiateLayerService({
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
              isChecked: true,
              isExpanded: true,
              type: 'radio',
            },
            '1-3': {
              isChecked: true,
              isExpanded: true,
              children: ['1-3-1'],
            },
            '1-3-1': {
              isChecked: true,
            },
            '2': {},
            '3': {
              isChecked: false,
              isExpanded: false,
              type: 'radio',
            },
          },
        });
        const spy = jest.spyOn(layerService, 'mutateTree');
        layerService.onItemChange('1');
        const updatedItems = layerService.treeData.items;

        expect(spy).toHaveBeenCalledTimes(5);
        ['1', '1-1', '1-2', '1-3', '1-3-1', '2', '3'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(false);
          expect(updatedItems[id].isExpanded).toBe(false);
        });
      });
    });

    describe('when siblings are uncheck', () => {
      test('uncheck all parents.', () => {
        const layerService = instantiateLayerService({
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
        });
        const spy = jest.spyOn(layerService, 'mutateTree');
        layerService.onItemChange('1-2');
        const updatedItems = layerService.treeData.items;

        expect(spy).toHaveBeenCalledTimes(3);
        ['1', '1-2'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(false);
        });
      });
    });
  });

  describe('when an checkbox item is unchecked', () => {
    test('uncheck all children', () => {
      const layerService = instantiateLayerService({
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
      });
      const spy = jest.spyOn(layerService, 'mutateTree');
      layerService.onItemChange('1');
      const updatedItems = layerService.treeData.items;

      expect(spy).toHaveBeenCalledTimes(5);
      ['root', '1', '1-2-1', '1-3'].forEach(id => {
        expect(updatedItems[id].isChecked).toBe(false);
      });
    });
  });

  describe('when siblings are uncheck', () => {
    test('uncheck all parents.', () => {
      const layerService = instantiateLayerService({
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
      });
      const spy = jest.spyOn(layerService, 'mutateTree');
      layerService.onItemChange('1-2');
      const updatedItems = layerService.treeData.items;

      expect(spy).toHaveBeenCalledTimes(5);
      ['1', '1-2'].forEach(id => {
        expect(updatedItems[id].isChecked).toBe(false);
      });
    });
  });

  describe('onItemToggle', () => {
    describe('expands', () => {
      test('a radio item', () => {
        const layerService = instantiateLayerService({
          rootId: 'root',
          items: {
            root: {
              children: ['1'],
            },
            '1': {
              type: 'radio',
              children: ['1-1'],
            },
            '1-1': {},
          },
        });
        const spy = jest.spyOn(layerService, 'mutateTree');
        layerService.onItemToggle(
          layerService.treeData.items['1'],
        );
        const updatedItems = layerService.treeData.items;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['1'].isChecked).toBe(false);
        expect(updatedItems['1'].isExpanded).toBe(true);
      });

      test('a checkbox item', () => {
        const layerService = instantiateLayerService({
          rootId: 'root',
          items: {
            root: {
              children: ['1'],
            },
            '1': {
              children: ['1-1'],
            },
            '1-1': {},
          },
        });
        const spy = jest.spyOn(layerService, 'mutateTree');
        layerService.onItemToggle(
          layerService.treeData.items['1'],
        );
        const updatedItems = layerService.treeData.items;

        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['1'].isChecked).toBe(false);
        expect(updatedItems['1'].isExpanded).toBe(true);
      });
    });

    describe('collapse', () => {
      test('a radio item', () => {
        const layerService = instantiateLayerService({
          rootId: 'root',
          items: {
            root: {
              children: ['1'],
            },
            '1': {
              type: 'radio',
              isExpanded: true,
              isChecked: true,
              children: ['1-1'],
            },
            '1-1': {
              isChecked: true,
            },
          },
        });
        const spy = jest.spyOn(layerService, 'mutateTree');
        layerService.onItemToggle(
          layerService.treeData.items['1'],
        );
        const updatedItems = layerService.treeData.items;

        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['1'].isChecked).toBe(true);
        expect(updatedItems['1'].isExpanded).toBe(false);
      });

      test('a checkbox item', () => {
        const layerService = instantiateLayerService({
          rootId: 'root',
          items: {
            root: {
              children: ['1'],
            },
            '1': {
              isExpanded: true,
              isChecked: true,
              children: ['1-1'],
            },
            '1-1': {
              isChecked: true,
            },
          },
        });
        const spy = jest.spyOn(layerService, 'mutateTree');
        layerService.onItemToggle(
          layerService.treeData.items['1'],
        );
        const updatedItems = layerService.treeData.items;

        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['1'].isChecked).toBe(true);
        expect(updatedItems['1'].isExpanded).toBe(false);
        expect(updatedItems['1-1'].isChecked).toBe(true);
      });
    });
  });
  */
});
