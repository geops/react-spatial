import 'jest-canvas-mock';
import { Layer } from 'mobility-toolbox-js/ol';
import LayerService from './LayerService';

describe('LayerService', () => {
  let layerService;

  beforeEach(() => {
    const layers = [
      new Layer({
        name: 'root',
      }),
      new Layer({
        name: '1',
        children: [
          new Layer({
            name: '1-1',
            properties: {
              radioGroup: 'radio',
            },
          }),
          new Layer({
            name: '1-2',
            properties: {
              radioGroup: 'radio',
            },
            visible: false,
            children: [
              new Layer({
                name: '1-2-1',
                visible: false,
              }),
              new Layer({
                name: '1-2-2',
                visible: false,
              }),
              new Layer({
                name: '2',
                visible: false,
              }),
            ],
          }),
        ],
      }),
    ];
    layerService = new LayerService(layers);
  });

  test('should instantiate LayerService class correctly.', () => {
    expect(layerService.getLayersAsFlatArray().length).toBe(7);
  });

  test('should return the correct number of layers.', () => {
    expect(layerService.getLayers().length).toBe(2);
  });

  test('should return layers by name.', () => {
    expect(layerService.getLayer('root')).toBeDefined();
    expect(layerService.getLayer('1-2-2')).toBeDefined();
    expect(layerService.getLayer('1-2')).toBeDefined();
    expect(layerService.getLayer('42')).toBeUndefined();
  });

  test('should return the parent layer.', () => {
    const child = layerService.getLayer('1-2');
    expect(layerService.getParent(child).name).toBe('1');
  });

  test('should return null if no radio name is given.', () => {
    expect(layerService.getRadioGroupLayers()).toBe(null);
  });

  test('should return radio layers.', () => {
    expect(layerService.getRadioGroupLayers('radio').length).toBe(2);
    expect(layerService.getRadioGroupLayers('no-radio').length).toBe(0);
  });

  test('should toggle radio layers.', () => {
    layerService.getLayer('1-1').setVisible(true);
    expect(layerService.getLayer('1-1').visible).toBe(true);
    layerService.getLayer('1-2').setVisible(true);
    expect(layerService.getLayer('1-1').visible).toBe(false);
  });

  test('should toggle child layers.', () => {
    layerService.getLayer('1-2').setVisible(true);
    expect(layerService.getLayer('1-2-1').visible).toBe(true);
    expect(layerService.getLayer('1-2-2').visible).toBe(true);
    expect(layerService.getLayer('2').visible).toBe(true);
  });

  test('should call back on visibility changes.', () => {
    const callback = jest.fn(() => {
      return 42;
    });
    layerService.on('change:visible', callback);
    layerService.getLayer('2').setVisible(true);
    expect(callback.mock.calls.length).toBe(3);
  });

  test('should set children from constructor', () => {
    const layer = new Layer({
      name: 'foo',
      children: [
        new Layer({
          name: 'bar',
        }),
      ],
    });
    expect(layer.children.length).toBe(1);
  });

  describe('#on() ', () => {
    test('add a callback on event.', () => {
      const cb = () => {};
      layerService.on('foo', cb);
      expect(layerService.callbacks.foo[0]).toBe(cb);
    });

    test("doesn't add twice the same callback .", () => {
      const cb = () => {};
      layerService.on('foo', cb);
      expect(layerService.callbacks.foo[0]).toBe(cb);
      layerService.on('foo', cb);
      expect(layerService.callbacks.foo[0]).toBe(cb);
      expect(layerService.callbacks.foo[1]).toBe(undefined);
    });
  });

  describe('#un() ', () => {
    test("doesn't failed if callback doesn't exists.", (done) => {
      const cb = () => {};
      try {
        layerService.un('foo', cb);
        done();
        // eslint-disable-next-line no-empty
      } catch (e) {}
    });

    test('remove a callback on event.', () => {
      const cb = () => {};
      const cb1 = () => {};
      const cb2 = () => {};
      layerService.on('foo', cb);
      layerService.on('foo', cb1);
      layerService.on('foo', cb2);
      expect(layerService.callbacks.foo[0]).toBe(cb);
      expect(layerService.callbacks.foo[1]).toBe(cb1);
      expect(layerService.callbacks.foo[2]).toBe(cb2);
      layerService.un('foo', cb1);
      expect(layerService.callbacks.foo[0]).toBe(cb);
      expect(layerService.callbacks.foo[1]).toBe(cb2);
      expect(layerService.callbacks.foo[2]).toBe(undefined);
    });
  });

  test('should unlisten keys in LayerService', () => {
    expect(layerService.keys.length).toBe(14);
    layerService.setLayers([]);
    expect(layerService.keys.length).toBe(0);
  });
});
