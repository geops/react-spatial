import 'jest-canvas-mock';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import VectorLayer from 'react-spatial/VectorLayer';
import VectorSource from 'ol/source/Vector';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import BasicMap from 'react-spatial/components/BasicMap';
import OLE from './OLE';

configure({ adapter: new Adapter() });
const mockStore = configureStore();
const initialState = {
  dispatchSetCenter: () => {},
  dispatchSetZoom: () => {},
  dispatchSetResolution: () => {},
  dispatchSetLayers: () => {},

  center: [922747.8054581558, 5911639.7675754195],
  layers: [],
  extent: undefined,
  resolution: undefined,
  zoom: 9,
};

const olView = new OLView();
const map = new OLMap({ view: olView });
const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [],
  }),
});
const layers = [vectorLayer];

describe('OLE', () => {
  test('matche snapshots', () => {
    const store = mockStore(initialState);
    window.ole = 'fgjkfgio';
    const component = renderer.create(
      <Provider store={store}>
        <BasicMap map={map} layers={layers} zoom={0} />
        <OLE map={map} layer={vectorLayer} />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
