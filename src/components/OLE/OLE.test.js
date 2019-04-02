import 'jest-canvas-mock';
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import VectorSource from 'ol/source/Vector';
import OLMap from 'ol/Map';
import View from 'ol/View';
import BasicMap from '../BasicMap';
import VectorLayer from '../../VectorLayer';
import OLE from '.';

configure({ adapter: new Adapter() });

const map = new OLMap({ view: new View() });
const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [],
  }),
});
const layers = [vectorLayer];

describe('OLE', () => {
  test('matche snapshots', () => {
    window.ole = 'fgjkfgio';
    const component = renderer.create(
      <>
        <BasicMap map={map} layers={layers} zoom={0} />
        <OLE map={map} layer={vectorLayer} />
      </>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
