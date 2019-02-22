import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LayerTree from './LayerTree';
import data, { applyDefaultValues } from '../../../data/TreeData.esm';

configure({ adapter: new Adapter() });

const mountLayerTree = newData => {
  const a = applyDefaultValues(newData);
  return mount(<LayerTree tree={a} />);
};
const classItem = '.tm-layer-tree-item';

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
    let wrapper;
    let spy;
    const data2 = {
      rootId: 'root',
      items: {
        root: {
          children: ['1'],
        },
        '1': {},
      },
    };
    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(data2.items['1']);
    };

    beforeEach(() => {
      wrapper = mountLayerTree(data2);
      spy = jest.spyOn(wrapper.instance(), 'onInputClick');
    });

    test('when we press enter with keyboard on the barrierfree element.', () => {
      wrapper
        .find(classItem)
        .first()
        .childAt(0)
        .simulate('keypress', { which: 13 });
      expectCalled();
    });

    test('when we press enter with keyboard on the label element.', () => {
      wrapper
        .find('label')
        .at(0)
        .simulate('keypress', { which: 13 });
      expectCalled();
    });

    test('when we click on input.', () => {
      wrapper
        .find('input')
        .at(0)
        .simulate('click');
      expectCalled();
    });

    test('when we click on toggle button (label+arrow) of an item without children.', () => {
      wrapper
        .find(classItem)
        .first()
        .childAt(2)
        .simulate('click');
      expectCalled();
    });
  });

  describe('triggers onToggle', () => {
    let wrapper;
    let spy;
    const data2 = {
      rootId: 'root',
      items: {
        root: {
          children: ['1'],
        },
        '1': {
          children: ['1-1'],
        },
        '1-1': {},
      },
    };
    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(data2.items['1']);
    };

    beforeEach(() => {
      wrapper = mountLayerTree(data2);
      spy = jest.spyOn(wrapper.instance(), 'onToggle');
    });

    test('when we click on toggle button (label+arrow) of an item with children.', () => {
      wrapper
        .find(classItem)
        .first()
        .childAt(2)
        .simulate('click');
      expectCalled();
    });
  });
});
