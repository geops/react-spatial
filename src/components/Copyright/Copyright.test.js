import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import { act } from 'react-dom/test-utils';
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

let layerService;

describe('Copyright', () => {
  beforeEach(() => {
    layerService = initLayerService();
  });

  test('is empty if no layers are visible', () => {
    const component = shallow(
      <Copyright layers={layerService.getLayersAsFlatArray()} />,
    );
    expect(component.html()).toBe(null);
  });

  test('displays the correct copyright', () => {
    layerService.getLayersAsFlatArray()[1].setVisible(true);
    const component = shallow(
      <Copyright layers={layerService.getLayersAsFlatArray()} />,
    );
    expect(component.text()).toBe('© Hot OSM Contributors');
  });

  test('displays a custom copyright', () => {
    layerService.getLayersAsFlatArray()[1].setVisible(true);
    const component = shallow(
      <Copyright
        layers={layerService.getLayersAsFlatArray()}
        format={copyrights => `Number of copyrights: ${copyrights.length}`}
      />,
    );
    expect(component.text()).toBe('Number of copyrights: 1');
  });

  test('update copyright when visibility change.', () => {
    const component = mount(
      <Copyright layers={layerService.getLayersAsFlatArray()} />,
    );
    expect(component.text()).toBe('');
    act(() => {
      layerService.getLayersAsFlatArray()[1].setVisible(true);
    });
    component.update();
    expect(component.text()).toBe('© Hot OSM Contributors');
    component.unmount();
  });

  test('listen/unlisten "change:visible" on mount/unmount.', () => {
    const layers = layerService.getLayersAsFlatArray();
    const cbs = [];

    // mount
    const spiesOn = layers.map(l => {
      return jest.spyOn(l, 'on');
    });
    const component = mount(<Copyright layers={layers} />);
    spiesOn.forEach(spy => {
      expect(spy).toHaveBeenCalledTimes(1);
      cbs.push(spy.mock.calls[0][1]);
    });

    // unmount
    const spiesUn = layers.map(l => {
      return jest.spyOn(l, 'un');
    });
    component.unmount();
    spiesUn.forEach((spy, idx) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('change:visible', cbs[idx]);
    });
  });
});
