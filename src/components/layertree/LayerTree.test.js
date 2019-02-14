import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'jest-canvas-mock';
import OLLayer from 'ol/layer/Vector';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import LayerTree from './LayerTree';
import Layer from '../../Layer';
import data from '../../../data/TreeData';

configure({ adapter: new Adapter() });

const extent = [0, 0, 0, 0];
const olView = new OLView();
const olMap = new OLMap({ view: olView });
const olLayers = [
  new Layer({
    name: 'foo',
    olLayer: new OLLayer({}),
    visible: true,
  }),
];

describe('LayerTree', () => {
  test('matches snapshots', () => {
    /* console.log(data);
    const component = renderer.create(<LayerTree tree={data} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot(); */
  });
});
