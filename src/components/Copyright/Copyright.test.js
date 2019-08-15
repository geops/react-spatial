import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import Copyright from './Copyright';
import ConfigReader from '../../ConfigReader';
import LayerService from '../../LayerService';

configure({ adapter: new Adapter() });

const initLayerService = () => {
  const data = [
    {
      name: 'OSM Baselayer',
      copyright: 'OSM Contributors',
      data: {
        type: 'xyz',
        url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    },
    {
      name: 'OSM Baselayer Hot',
      copyright: 'Hot OSM Contributors',
      data: {
        type: 'xyz',
        url: 'https://c.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      },
    },
    {
      name: 'OpenTopoMap',
      copyright: 'Some Copyright',
      data: {
        type: 'xyz',
        url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
      },
    },
  ];

  const layers = ConfigReader.readConfig(data);
  return new LayerService(layers);
};

describe('Copyright', () => {
  test('is empty if no layers are visible', () => {
    const layerService = initLayerService();
    const component = mount(<Copyright layerService={layerService} />);
    expect(component.html()).toBe(null);
  });

  test('displays the correct copyright', () => {
    const layerService = initLayerService();
    layerService.getLayersAsFlatArray()[1].setVisible(true);
    const component = mount(<Copyright layerService={layerService} />);
    expect(component.text()).toBe('© Hot OSM Contributors');
  });

  test('displays a custom copyright', () => {
    const layerService = initLayerService();
    layerService.getLayersAsFlatArray()[1].setVisible(true);
    const component = mount(
      <Copyright
        layerService={layerService}
        format={copyrights => `Number of copyrights: ${copyrights.length}`}
      />,
    );
    expect(component.text()).toBe('Number of copyrights: 1');
  });

  test('listens to change events on a new LayerService', () => {
    const layerService = initLayerService();
    const component = mount(<Copyright layerService={layerService} />);
    const newLayerService = initLayerService();
    const spy = jest.spyOn(LayerService.prototype, 'on');
    component.setProps({ layerService: newLayerService });
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toBe('change:visible');
  });
});
