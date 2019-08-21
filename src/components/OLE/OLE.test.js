import 'jest-canvas-mock';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import OLMap from 'ol/Map';
import View from 'ol/View';
import Layer from '../../layers/Layer';
import OLE from '.';

configure({ adapter: new Adapter() });

const map = new OLMap({ view: new View() });
const vectorLayer = new Layer({
  name: 'Sample',
  olLayer: new VectorLayer({
    source: new VectorSource({
      features: [],
    }),
  }),
});

describe('OLE', () => {
  beforeEach(() => {
    map.setTarget(document.createElement('div'));
  });

  test('matches snapshots', () => {
    window.ole = 'fgjkfgio';
    const component = renderer.create(<OLE map={map} layer={vectorLayer} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('creates Editor with all controls with no error', () => {
    window.ole = 'fgjkfgio';
    mount(
      <OLE
        map={map}
        layer={vectorLayer}
        cad
        drawPoint
        drawCustoms={[{}]}
        drawLineString
        drawPolygon
        rotate
        modify
        buffer
        union
        intersection
        difference
      />,
    );
  });

  test('creates Editor without controls with no error', () => {
    window.ole = 'fgjkfgio';
    mount(
      <OLE
        map={map}
        layer={vectorLayer}
        cad={false}
        drawPoint={false}
        drawLineString={false}
        drawPolygon={false}
        rotate={false}
        modify={false}
        buffer={false}
        union={false}
        intersection={false}
        difference={false}
      />,
    );
  });
});
