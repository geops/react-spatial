import 'jest-canvas-mock';
import LayerService from './LayerService';
import ConfigReader from './ConfigReader';

describe('LayerService', () => {
  const instantiateLayerService = data => {
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
          radioGroup: 'radio',
        },
        {
          name: '1-2',
          radioGroup: 'radio',
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
    expect(layerService.getParent(child).getName()).toBe('1');
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
    expect(layerService.getLayer('1-1').getVisible()).toBe(true);
    layerService.getLayer('1-2').setVisible(true);
    expect(layerService.getLayer('1-1').getVisible()).toBe(false);
  });

  test('should toggle child layers.', () => {
    const layerService = instantiateLayerService(layerData);
    layerService.getLayer('1-2').setVisible(true);
    expect(layerService.getLayer('1-2-1').getVisible()).toBe(true);
    expect(layerService.getLayer('1-2-2').getVisible()).toBe(true);
    expect(layerService.getLayer('2').getVisible()).toBe(true);
  });

  test('should call back on visibility changes.', () => {
    const layerService = instantiateLayerService(layerData);
    const callback = jest.fn(() => 42);
    layerService.on('change:visible', callback);
    layerService.getLayer('2').setVisible(true);
    expect(callback.mock.calls.length).toBe(3);
  });
});
