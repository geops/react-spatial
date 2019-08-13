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
    const search =
      '?layers=switzerland.samples,usa.population.density,lines.samples';

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

  test('shoud limit 2 decimals by default for x, y.', () => {
    expect(window.location.search).toEqual('');
    const olMap = new OLMap({
      controls: [],
      view: new View({
        center: [10.555555, 10.5555555],
        zoom: 5,
      }),
    });
    mount(<Permalink map={olMap} />);
    olMap.dispatchEvent(new MapEvent('moveend', olMap));
    const search = '?x=10.56&y=10.56&z=5';

    expect(window.location.search).toEqual(search);
  });

  test('shoud round values x & y ".00" for readability.', () => {
    expect(window.location.search).toEqual('');
    const olMap = new OLMap({
      controls: [],
      view: new View({
        center: [10.99999, 1.000001],
        zoom: 5,
      }),
    });
    mount(<Permalink map={olMap} />);
    olMap.dispatchEvent(new MapEvent('moveend', olMap));
    const search = '?x=11&y=1&z=5';

    expect(window.location.search).toEqual(search);
  });

  test('shoud limit 4 decimals with props "coordinateDecimals".', () => {
    expect(window.location.search).toEqual('');
    const olMap = new OLMap({
      controls: [],
      view: new View({
        center: [10.555555, 10.5555555],
        zoom: 5,
      }),
    });
    mount(<Permalink map={olMap} coordinateDecimals={4} />);
    olMap.dispatchEvent(new MapEvent('moveend', olMap));
    const search = '?x=10.5556&y=10.5556&z=5';

    expect(window.location.search).toEqual(search);
  });

  test('shoud react on layerService change.', () => {
    expect(window.location.search).toEqual('');
    const map = new OLMap({ controls: [] });
    const layers = ConfigReader.readConfig(map, data);
    const layerService = new LayerService(layers);
    const permalink = mount(<Permalink layerService={layerService} />);
    const search = '?layers=lines%20samples';

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
    const search =
      '?layers=switzerland.samples,usa.population.density,polygon.samples';
    const callback = jest.fn(() => 42);
    layerService.on('change:visible', callback);
    layerService.getLayer('Polygons Samples').setVisible(true);

    expect(window.location.search).toEqual(search);
  });
});
