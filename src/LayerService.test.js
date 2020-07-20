import 'jest-canvas-mock';
import { Layer } from 'mobility-toolbox-js/ol';
import LayerService from './LayerService';
import ConfigReader from './ConfigReader';

describe('LayerService', () => {
  const instantiateLayerService = (data) => {
    const layers = ConfigReader.readConfig(data);
    return new LayerService(layers);
  };

  const layerData = [
    {
      name: 'root',
    },
    {
      name: '1',
      children: [
        {
          name: '1-1',
          properties: {
            radioGroup: 'radio',
          },
        },
        {
          name: '1-2',
          properties: {
            radioGroup: 'radio',
          },
          children: [{ name: '1-2-1' }, { name: '1-2-2' }, { name: '2' }],
        },
      ],
    },
  ];

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
    expect(layerService.getParent(child).name).toBe('1');
  });

  test('should return null if no radio name is given.', () => {
    const layerService = instantiateLayerService(layerData);
    expect(layerService.getRadioGroupLayers()).toBe(null);
  });

  test('should return radio layers.', () => {
    const layerService = instantiateLayerService(layerData);
    expect(layerService.getRadioGroupLayers('radio').length).toBe(2);
    expect(layerService.getRadioGroupLayers('no-radio').length).toBe(0);
  });

  test('should toggle radio layers.', () => {
    const layerService = instantiateLayerService(layerData);
    layerService.getLayer('1-1').setVisible(true);
    expect(layerService.getLayer('1-1').visible).toBe(true);
    layerService.getLayer('1-2').setVisible(true);
    expect(layerService.getLayer('1-1').visible).toBe(false);
  });

  test('should toggle child layers.', () => {
    const layerService = instantiateLayerService(layerData);
    layerService.getLayer('1-2').setVisible(true);
    expect(layerService.getLayer('1-2-1').visible).toBe(true);
    expect(layerService.getLayer('1-2-2').visible).toBe(true);
    expect(layerService.getLayer('2').visible).toBe(true);
  });

  test('should call back on visibility changes.', () => {
    const layerService = instantiateLayerService(layerData);
    const callback = jest.fn(() => 42);
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
      const layerService = instantiateLayerService(layerData);
      const cb = () => {};
      layerService.on('foo', cb);
      expect(layerService.callbacks.foo[0]).toBe(cb);
    });

    test("doesn't add twice the same callback .", () => {
      const layerService = instantiateLayerService(layerData);
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
      const layerService = instantiateLayerService(layerData);
      const cb = () => {};
      try {
        layerService.un('foo', cb);
        done();
        // eslint-disable-next-line no-empty
      } catch (e) {}
    });

    test('remove a callback on event.', () => {
      const layerService = instantiateLayerService(layerData);
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
});
