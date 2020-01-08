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

  test('should initialize x, y & z with history.', () => {
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

  test('should initialize x, y & z Permalink without history.', () => {
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

  test('should initialize Permalink with layerService.', () => {
    expect(window.location.search).toEqual('');
    const layers = ConfigReader.readConfig(data);
    const layerService = new LayerService(layers);
    mount(<Permalink layerService={layerService} />);
    const search =
      '?baselayers=osm.baselayer,osm.baselayer.hot,open.topo.map&layers=switzerland.samples,usa.population.density,lines.samples';

    expect(window.location.search).toEqual(search);
  });

  test('should initialize Permalink with isLayerHidden.', () => {
    expect(window.location.search).toEqual('');
    const layers = ConfigReader.readConfig(data);
    const layerService = new LayerService(layers);
    mount(
      <Permalink
        layerService={layerService}
        isLayerHidden={l =>
          l.get('hideInLegend') ||
          layerService.getParents(l).some(pl => pl.get('hideInLegend'))
        }
      />,
    );
    const search =
      '?baselayers=osm.baselayer,osm.baselayer.hot,open.topo.map&layers=usa.population.density';

    expect(window.location.search).toEqual(search);
  });

  test('should initialize Permalink with map.', () => {
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

  test('should limit 2 decimals by default for x, y.', () => {
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

  test('should round values x & y ".00" for readability.', () => {
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

  test('should limit 4 decimals with props "coordinateDecimals".', () => {
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

  test('should react on layerService change.', () => {
    expect(window.location.search).toEqual('');
    const layers = ConfigReader.readConfig(data);
    const layerService = new LayerService(layers);
    const permalink = mount(<Permalink layerService={layerService} />);
    const search = '?layers=lines%20samples';

    const layers2 = ConfigReader.readConfig(data2);
    const layerService2 = new LayerService(layers2);
    permalink.setProps({ layerService: layerService2 }).update();

    expect(window.location.search).toEqual(search);
  });

  test('should react on layer visiblity change.', () => {
    expect(window.location.search).toEqual('');
    const layers = ConfigReader.readConfig(data);
    const layerService = new LayerService(layers);
    mount(<Permalink layerService={layerService} />);
    layerService.getLayer('Polygons Samples').setVisible(true);

    expect(
      /layers=switzerland\.samples,usa\.population\.density,polygon\.samples/.test(
        window.location.search,
      ),
    ).toBe(true);
  });

  test('should react on base layer visiblity change.', () => {
    expect(window.location.search).toEqual('');
    const layers = ConfigReader.readConfig(data);
    const layerService = new LayerService(layers);
    mount(<Permalink layerService={layerService} />);
    expect(
      /baselayers=osm\.baselayer,osm\.baselayer\.hot,open\.topo\.map/.test(
        window.location.search,
      ),
    ).toBe(true);

    layerService.getLayer('OSM Baselayer Hot').setVisible(true);

    expect(
      /baselayers=osm\.baselayer\.hot,osm\.baselayer,open\.topo\.map/.test(
        window.location.search,
      ),
    ).toBe(true);
  });
});
