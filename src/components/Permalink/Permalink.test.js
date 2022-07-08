import 'jest-canvas-mock';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MapEvent from 'ol/MapEvent';
import OLMap from 'ol/Map';
import View from 'ol/View';
import { Layer, MapboxLayer } from 'mobility-toolbox-js/ol';
import { render } from '@testing-library/react';
import Permalink from './Permalink';

configure({ adapter: new Adapter() });

const defaultIsLayerHidden = (l) => {
  let isParentHidden = false;
  let { parent } = l;
  while (!isParentHidden && parent) {
    isParentHidden = parent.get('hideInLegend');
    parent = parent.parent;
  }

  return l.get('hideInLegend') || isParentHidden;
};

describe('Permalink', () => {
  let layers;
  beforeEach(() => {
    // Ensure default empty url.
    window.history.pushState({}, undefined, '/');
    layers = [
      new Layer({
        name: 'Ultimate layer',
        key: 'ultimate.layer',
        visible: true,
        properties: {
          hideInLegend: true,
        },
      }),
      new Layer({
        name: 'Swiss boundaries',
        key: 'swiss.boundaries',
        visible: false,
        properties: {
          hideInLegend: true,
        },
      }),
      new MapboxLayer({
        name: 'Base - Bright',
        key: 'basebright.baselayer',
        group: 'baseLayer',
        properties: {
          isBaseLayer: true,
        },
      }),
      new MapboxLayer({
        name: 'Base - Dark',
        key: 'basedark.baselayer',
        visible: false,
        group: 'baseLayer',
        properties: {
          isBaseLayer: true,
        },
      }),
      new Layer({
        name: 'Layer with children that are hidden',
        key: 'children.hidden.layer',
        visible: true,
        children: [
          new Layer({
            name: 'Child 1 hidden',
            key: 'child.hidden.1',
            visible: true,
            properties: {
              hideInLegend: true,
            },
          }),
          new Layer({
            name: 'Childr 2 hidden',
            key: 'child.hidden.2',
            visible: false,
            properties: {
              hideInLegend: true,
            },
          }),
        ],
      }),
    ];
  });

  test('should initialize x, y & z with history.', () => {
    const history = {
      replace: jest.fn((v) => {
        return v;
      }),
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

  test('should initialize Permalink with layers.', () => {
    expect(window.location.search).toEqual('');
    mount(<Permalink layers={layers} />);
    const search =
      '?baselayers=basebright.baselayer,basedark.baselayer&layers=ultimate.layer,child.hidden.1';
    expect(window.location.search).toEqual(search);
  });

  test('should initialize Permalink with isLayerHidden.', () => {
    expect(window.location.search).toEqual('');
    mount(<Permalink layers={layers} isLayerHidden={defaultIsLayerHidden} />);
    const search =
      '?baselayers=basebright.baselayer,basedark.baselayer&layers=children.hidden.layer';
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

  test('should react on layers change.', () => {
    expect(window.location.search).toEqual('');
    const permalink = mount(<Permalink layers={layers} />);
    let layersParam = new URLSearchParams(window.location.search).get('layers');
    expect(layersParam).toBe('ultimate.layer,child.hidden.1');

    permalink
      .setProps({
        layers: [
          new Layer({
            name: 'foo',
            key: 'foo.layer',
          }),
        ],
      })
      .update();

    layersParam = new URLSearchParams(window.location.search).get('layers');
    expect(layersParam).toBe('foo.layer');
  });

  test('should react on layer visiblity change.', () => {
    expect(window.location.search).toEqual('');
    mount(<Permalink layers={layers} />);
    let layersParam = new URLSearchParams(window.location.search).get('layers');
    expect(layersParam).toBe('ultimate.layer,child.hidden.1');

    layers.find((l) => {
      return l.name === 'Swiss boundaries';
    }).visible = true;

    layersParam = new URLSearchParams(window.location.search).get('layers');
    expect(layersParam).toBe('ultimate.layer,swiss.boundaries,child.hidden.1');
  });

  test('should react on base layer visiblity change.', () => {
    expect(window.location.search).toEqual('');
    render(<Permalink layers={layers} />);

    let baseLayers = new URLSearchParams(window.location.search).get(
      'baselayers',
    );
    expect(baseLayers).toBe('basebright.baselayer,basedark.baselayer');

    layers.find((l) => {
      return l.name === 'Base - Dark';
    }).visible = true;

    baseLayers = new URLSearchParams(window.location.search).get('baselayers');
    expect(baseLayers).toBe('basedark.baselayer,basebright.baselayer');
  });
});
