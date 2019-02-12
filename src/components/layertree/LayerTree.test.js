import 'jest-canvas-mock';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import OLLayer from 'ol/layer/Vector';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import LayerTree from './LayerTree';
import Layer from '../../Layer';
import treeData from '../../../data/TreeData';

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
    const component = renderer.create(
      <LayerTree>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
