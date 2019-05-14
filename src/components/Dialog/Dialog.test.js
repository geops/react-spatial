import React from 'react';
import renderer from 'react-test-renderer';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import Draggable from 'react-draggable';
import Dialog from '.';

configure({ adapter: new Adapter() });

describe('Dialog', () => {
  describe('matches snapshots', () => {
    test('for closed Dialog.', () => {
      const component = renderer.create(
        <Dialog onClose={() => {}} isOpen={false} />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('for normal Dialog.', () => {
      const component = renderer.create(
        <Dialog
          title={<span>Example Dialog</span>}
          onClose={() => {}}
          isDraggable
          isOpen
        >
          <span>content</span>
        </Dialog>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('for modal Dialog.', () => {
      const component = renderer.create(
        <Dialog onClose={() => {}} isModal isOpen>
          <span>content</span>
        </Dialog>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  test('triggers onClose.', () => {
    const fn = jest.fn();
    const wrapper = mount(
      <Dialog onClose={fn} isOpen classNameCloseBt="tm-close-classname">
        <span>content</span>
      </Dialog>,
    );

    wrapper
      .find('.tm-close-classname')
      .at(1)
      .simulate('click');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('set dialog position.', () => {
    const fn = jest.fn();
    const wrapper = mount(
      <Dialog onClose={fn} isOpen isDraggable>
        <span>content</span>
      </Dialog>,
    );
    wrapper.setProps({
      position: {
        x: 9,
        y: 9,
      },
    });

    const draggable = wrapper.find('.react-draggable');
    expect(draggable.prop('style').transform).toBe('translate(9px,9px)');
  });
});
