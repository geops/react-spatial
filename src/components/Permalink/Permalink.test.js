import 'jest-canvas-mock';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MapEvent from 'ol/MapEvent';
import OLMap from 'ol/Map';
import View from 'ol/View';
import data from '../../../data/TreeData';
import data2 from '../../../data/ExampleData';
import LayerService from '../../LayerService';
import ConfigReader from '../../ConfigReader';
import Permalink from './Permalink';

configure({ adapter: new Adapter() });

describe('Permalink', () => {
  beforeEach(() => {
    // Ensure default empty url.
    window.history.pushState({}, undefined, '/');
  });

  test('shoud initialize x, y & z with history.', () => {
    const history = {
      replace: jest.fn(v => v),
    };

    const params = {
      x: 0,
      y: 0,
      z: 7,
    };

    const permalink = mount(<Permalink params={params} history={history} />);

    permalink
      .setProps({
        params: {
          x: 1,
          y: 2,
          z: 7,
        },
      })
      .update();
    const search = '?x=1&y=2&z=7';

    expect(history.replace.mock.results[0].value.search).toEqual(search);
  });

  test('shoud initialize x, y & z Permalink without history.', () => {
    const params = {
      x: 0,
      y: 0,
      z: 7,
    };

    const permalink = mount(<Permalink params={params} />);

    permalink
      .setProps({
        params: {
          x: 1,
          y: 2,
          z: 7,
        },
      })
      .update();
    const search = '?x=1&y=2&z=7';

    expect(window.location.search).toEqual(search);
  });

  test('shoud initialize Permalink with layerService.', () => {
    expect(window.location.search).toEqual('');
    const map = new OLMap({ controls: [] });
    const layers = ConfigReader.readConfig(map, data);
    const layerService = new LayerService(layers);
    mount(<Permalink layerService={layerService} />);
    const search = '?layers=usaPop,lineSamples';

    expect(window.location.search).toEqual(search);
  });

  test('shoud initialize Permalink with map.', () => {
    expect(window.location.search).toEqual('');
    const olMap = new OLMap({
      controls: [],
      view: new View({
        center: [1, 2],
        zoom: 5,
      }),
    });
    mount(<Permalink map={olMap} />);
    olMap.dispatchEvent(new MapEvent('moveend', olMap));
    const search = '?x=1&y=2&z=5';

    expect(window.location.search).toEqual(search);
  });

  test('shoud react on layerService change.', () => {
    expect(window.location.search).toEqual('');
    const map = new OLMap({ controls: [] });
    const layers = ConfigReader.readConfig(map, data);
    const layerService = new LayerService(layers);
    const permalink = mount(<Permalink layerService={layerService} />);
    const search = '?layers=lineSamples';

    const layers2 = ConfigReader.readConfig(map, data2);
    const layerService2 = new LayerService(layers2);
    permalink.setProps({ layerService: layerService2 }).update();

    expect(window.location.search).toEqual(search);
  });

  test('shoud react on layer visiblity change.', () => {
    expect(window.location.search).toEqual('');
    const map = new OLMap({ controls: [] });
    const layers = ConfigReader.readConfig(map, data);
    const layerService = new LayerService(layers);
    mount(<Permalink layerService={layerService} />);
    const search = '?layers=usaPop,polySamples';
    const callback = jest.fn(() => 42);
    layerService.on('change:visible', callback);
    layerService.getLayer('Polygons Samples').setVisible(true);

    expect(window.location.search).toEqual(search);
  });
});
