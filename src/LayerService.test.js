import 'jest-canvas-mock';
import OLMap from 'ol/Map';
import LayerService from './LayerService';
import { applyDefaultValues } from '../data/TreeData.esm';
import testData from '../data/TestData.esm';

describe('LayerService', () => {
  const instantiateLayerService = initData => {
    const map = new OLMap();
    const treeData = applyDefaultValues(initData);
    return new LayerService({
      map,
      treeData,
      dataStyle: {},
    });
  };

  const getLayers = wrapper => wrapper.map.getLayers().getArray();

  describe('onItemChange', () => {
    describe('when an checkbox item is checked,', () => {
      test('check only this checkbox.', () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'onItemChange');
        layerServiceInstance.onItemChange('2');
        const updatedItems = layerServiceInstance.treeData.items;

        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['2'].isChecked).toBe(true);
      });

      test('check all children.', () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemChange('1');
        const updatedItems = layerServiceInstance.treeData.items;

        expect(spy).toHaveBeenCalledTimes(5);
        ['1', '1-1', '1-2', '1-2-1'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(true);
        });
        expect(updatedItems['2'].isChecked).toBe(false);
      });

      describe('when siblings are uncheck,', () => {
        test('check all parents', () => {
          const layerServiceInstance = instantiateLayerService({
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
          const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
          layerServiceInstance.onItemChange('1-2-1');
          const updatedItems = layerServiceInstance.treeData.items;

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

    describe('when an checkbox item is unchecked', () => {
      test('uncheck all children', () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemChange('1');
        const updatedItems = layerServiceInstance.treeData.items;

        expect(spy).toHaveBeenCalledTimes(5);
        ['root', '1', '1-2-1', '1-3'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(false);
        });
      });
    });

    describe('when an radio item is checked', () => {
      test(`expands the item, uncheck and collapse all the radio siblings and
      their children, then apply defaults to the item's children.`, () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemChange('1');
        const updatedItems = layerServiceInstance.treeData.items;

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
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemChange('1-1');
        const updatedItems = layerServiceInstance.treeData.items;

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
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemChange('1');
        const updatedItems = layerServiceInstance.treeData.items;

        expect(spy).toHaveBeenCalledTimes(5);
        ['1', '1-1', '1-2', '1-3', '1-3-1', '2', '3'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(false);
          expect(updatedItems[id].isExpanded).toBe(false);
        });
      });
    });

    describe('when radio child is uncheck', () => {
      test('uncheck all parents.', () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemChange('1-2');
        const updatedItems = layerServiceInstance.treeData.items;

        expect(spy).toHaveBeenCalledTimes(3);
        ['1', '1-2'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(false);
        });
      });
    });

    describe('when checkbox child is uncheck', () => {
      test('uncheck all parents.', () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemChange('1-2');
        const updatedItems = layerServiceInstance.treeData.items;

        expect(spy).toHaveBeenCalledTimes(5);
        ['1', '1-2'].forEach(id => {
          expect(updatedItems[id].isChecked).toBe(false);
        });
      });
    });
  });

  describe('onItemToggle', () => {
    describe('expands', () => {
      test('a radio item', () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemToggle(
          layerServiceInstance.treeData.items['1'],
        );
        const updatedItems = layerServiceInstance.treeData.items;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['1'].isChecked).toBe(false);
        expect(updatedItems['1'].isExpanded).toBe(true);
      });

      test('a checkbox item', () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemToggle(
          layerServiceInstance.treeData.items['1'],
        );
        const updatedItems = layerServiceInstance.treeData.items;

        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['1'].isChecked).toBe(false);
        expect(updatedItems['1'].isExpanded).toBe(true);
      });
    });

    describe('collapse', () => {
      test('a radio item', () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemToggle(
          layerServiceInstance.treeData.items['1'],
        );
        const updatedItems = layerServiceInstance.treeData.items;

        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['1'].isChecked).toBe(true);
        expect(updatedItems['1'].isExpanded).toBe(false);
      });

      test('a checkbox item', () => {
        const layerServiceInstance = instantiateLayerService({
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
        const spy = jest.spyOn(layerServiceInstance, 'mutateTree');
        layerServiceInstance.onItemToggle(
          layerServiceInstance.treeData.items['1'],
        );
        const updatedItems = layerServiceInstance.treeData.items;

        expect(spy).toHaveBeenCalledTimes(1);
        expect(updatedItems['1'].isChecked).toBe(true);
        expect(updatedItems['1'].isExpanded).toBe(false);
        expect(updatedItems['1-1'].isChecked).toBe(true);
      });
    });
  });

  describe('when layerService initialized,', () => {
    let spy = null;

    afterEach(() => {
      if (spy) {
        spy.mockRestore();
      }
    });

    test('should instantiate LayerService class correctly.', () => {
      const layerServiceInstance = instantiateLayerService({
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
      expect(Object.keys(layerServiceInstance.treeData.items).length).toBe(7);
    });

    test('should initial layers be displayed.', () => {
      spy = jest.spyOn(LayerService.prototype, 'addLayer');
      const layerServiceInstance = instantiateLayerService(testData);
      const layers = getLayers(layerServiceInstance);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(layers.length).toBe(2);
    });

    test('should initialy create a vector layer.', () => {
      spy = jest.spyOn(LayerService.prototype, 'createVectorLayer');
      const layerServiceInstance = instantiateLayerService({
        rootId: 'root',
        items: {
          root: {
            id: 'root',
            children: ['topic'],
          },
          topic: {
            id: 'topic',
            isChecked: true,
            isExpanded: true,
            type: 'radio',
            children: ['vectorLayer'],
          },
          vectorLayer: {
            id: 'vectorLayer',
            isChecked: true,
            data: {
              type: 'vectorLayer',
            },
          },
        },
      });
      const layers = getLayers(layerServiceInstance);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(layers.length).toBe(1);
    });

    test('should initialy create a wmts layer.', () => {
      spy = jest.spyOn(LayerService.prototype, 'createWMTSLayer');
      const layerServiceInstance = instantiateLayerService({
        rootId: 'root',
        items: {
          root: {
            id: 'root',
            children: ['topic'],
          },
          topic: {
            id: 'topic',
            isChecked: true,
            isExpanded: true,
            type: 'radio',
            children: ['wmtsLayer'],
          },
          wmtsLayer: {
            id: 'wmtsLayer',
            isChecked: true,
            data: {
              type: 'wmts',
            },
          },
        },
      });
      const layers = getLayers(layerServiceInstance);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(layers.length).toBe(1);
    });
  });

  describe('on layertree interaction,', () => {
    let spy = null;

    afterEach(() => {
      spy.mockRestore();
    });

    describe('on unselected layer click,', () => {
      test('should add this layer to the map.', () => {
        const layerServiceInstance = instantiateLayerService({
          rootId: 'root',
          items: {
            root: {
              id: 'root',
              children: ['topic'],
            },
            topic: {
              id: 'topic',
              isChecked: true,
              isExpanded: true,
              children: ['vectorLayer1', 'vectorLayer2'],
            },
            vectorLayer1: {
              id: 'vectorLayer1',
              isChecked: true,
              data: {
                type: 'vectorLayer',
              },
            },
            vectorLayer2: {
              id: 'vectorLayer2',
              isChecked: false,
              data: {
                type: 'vectorLayer',
              },
            },
          },
        });
        const layers = getLayers(layerServiceInstance);
        expect(layers.length).toBe(1);
        spy = jest.spyOn(layerServiceInstance, 'addLayer');
        layerServiceInstance.onItemChange('vectorLayer2');

        expect(spy).toHaveBeenCalledTimes(1);
        expect(layers.length).toBe(2);
      });
    });
  });
});
