import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Checkbox from './Checkbox';

configure({ adapter: new Adapter() });

describe('Checkbox', () => {
  describe('matches snapshots', () => {
    test('for inputType Checkbox.', () => {
      const component = renderer.create(
        <Checkbox className="tm-checkbox-chbx-example" onClick={() => {}} />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('for inputType Radio.', () => {
      const checked = true;
      const component = renderer.create(
        <Checkbox
          className="tm-checkbox-radio-ex"
          inputType="radio"
          checked={checked}
          onClick={() => {}}
        />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('triggers onClick', () => {
    let wrapper;
    let spy;
    let checked = true;

    const funcs = {
      onCheckboxClick: () => {
        checked = !checked;
      },
    };

    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
    };

    beforeEach(() => {
      wrapper = shallow(
        <Checkbox
          className="tm-checkbox-ex"
          checked={checked}
          onClick={() => funcs.onCheckboxClick()}
        />,
      );
      spy = jest.spyOn(funcs, 'onCheckboxClick');
    });

    afterEach(() => {
      spy.mockRestore();
    });

    test('Checkbox should be clicked.', () => {
      wrapper.find({ type: 'checkbox' }).simulate('click');
      expectCalled();
    });

    test('Checkbox should be clicked.', () => {
      wrapper
        .find('label')
        .first()
        .simulate('keypress', { which: 13 });
      expectCalled();
    });
  });
});
