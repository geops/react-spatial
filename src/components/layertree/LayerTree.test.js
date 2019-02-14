import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LayerTree from './LayerTree';
import data from '../../../data/TreeData';

configure({ adapter: new Adapter() });

describe('LayerTree', () => {
  test('matches snapshots', () => {
    // TEst renderer cannot be use because of th DnD functionnality taht need an existing Html element
    const component = mount(<LayerTree tree={data} />);
    expect(component.html()).toMatchSnapshot();
  });
});
