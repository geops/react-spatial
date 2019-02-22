import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LayerTree from './LayerTree';
import data, { applyDefaultValues } from '../../../data/TreeData.esm';

configure({ adapter: new Adapter() });

const mountLayerTree = newData =>
  mount(<LayerTree tree={applyDefaultValues(newData)} />);

describe('LayerTree', () => {
  describe('matches snapshots', () => {
    test('using default properties.', () => {
      /*
      Test-renderer cannot be use because of th DnD functionnality
      which needs an existing Html element
      */
      const wrapper = mount(<LayerTree tree={data} />);
      expect(wrapper.html()).toMatchSnapshot();
    });

    test('when renderItem is used.', () => {
      /*
      Test-renderer cannot be use because of th DnD functionnality
      which needs an existing Html element
      */
      const wrapper = mount(
        <LayerTree tree={data} renderItem={item => <div>{item.title}</div>} />,
      );
      expect(wrapper.html()).toMatchSnapshot();
    });

    test('when an item is hidden.', () => {
      /*
      Test-renderer cannot be use because of th DnD functionnality
      which needs an existing Html element
      */
      const wrapper = mount(
        <LayerTree tree={data} isItemHidden={item => !!item.children.length} />,
      );
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('triggers onInputClick', () => {
    test.only('when we press enter with keyboard on the barrierfree element.', () => {
      const wrapper = mount(<LayerTree tree={data} />);
      const spy = jest.spyOn(wrapper.instance(), 'onInputClick');
      wrapper
        .find('.tm-layer-tree-item')
        .first()
        .childAt(0)
        .simulate('keypress', { which: 13 });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test.only('when we click on toggle button (label+arrow) of an item without children.', () => {
      const data2 = {
        rootId: 'root',
        items: {
          root: {
            type: 'radio',
            children: ['1'],
          },
          '1': {
            type: 'radio',
            children: ['1-1'],
          },
          '1-1': {
            type: 'radio',
          },
        },
      };
      const wrapper = mountLayerTree(data2);

      expect(wrapper.html()).toMatchSnapshot();
      /* const spy = jest.spyOn(wrapper.instance(), 'onInputClick');
      console.log(wrapper.find('.tm-layer-tree-item').html());
      wrapper
        .find('.tm-layer-tree-item')
        .at(1)
        .simulate('keypress', { which: 13 });
      expect(spy).toHaveBeenCalledTimes(1); */
    });
  });
});
