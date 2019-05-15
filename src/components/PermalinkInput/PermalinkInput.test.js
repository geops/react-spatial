import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import PermalinkInput from './PermalinkInput';

configure({ adapter: new Adapter() });

describe('PermalinkInput', () => {
  test('matches snapshot', () => {
    const component = renderer.create(
      <PermalinkInput value="http://url.test" />,
    );
    expect(component.toJSON()).toMatchSnapshot();
    component.getInstance().setState({ permalinkValue: 'http://url.test' });
    expect(component.toJSON()).toMatchSnapshot();
  });

  describe('when interacts,', () => {
    let getShortenedUrl = null;

    beforeEach(() => {
      getShortenedUrl = jest.fn(val => {
        return new Promise(resolve => {
          return resolve(val);
        });
      });
    });

    test('Promise resolution set input value.', () => {
      const wrapper = shallow(
        <PermalinkInput getShortenedUrl={getShortenedUrl} />,
      );
      wrapper.setProps({ value: 'http://url.test' });
      wrapper
        .instance()
        .updatePermalinkValue()
        .then(() => {
          const input = wrapper
            .find('input')
            .first()
            .getElement();

          expect(input.props.value).toBe('http://url.test');
        });
    });

    test('getShortenedUrl is called to set value.', () => {
      shallow(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );

      expect(getShortenedUrl).toHaveBeenCalledTimes(1);
      expect(getShortenedUrl).toHaveBeenCalledWith('http://url.test');
    });

    test('select value on input click.', () => {
      document.execCommand = jest.fn();
      const wrapper = mount(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );
      const spy = jest.spyOn(PermalinkInput, 'selectInput');

      expect(spy).toHaveBeenCalledTimes(0);

      wrapper
        .instance()
        .updatePermalinkValue()
        .then(() => {
          wrapper.update();
          wrapper
            .find('input')
            .first()
            .simulate('click');

          expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    test('click button copy the value.', () => {
      document.execCommand = jest.fn();
      const wrapper = mount(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );
      const spy = jest.spyOn(wrapper.instance(), 'onClickCopyButton');

      expect(spy).toHaveBeenCalledTimes(0);

      wrapper
        .instance()
        .updatePermalinkValue()
        .then(() => {
          wrapper.update();
          wrapper
            .find('.tm-permalink-bt')
            .first()
            .simulate('click');
          expect(spy).toHaveBeenCalledTimes(1);
        });
    });
  });
});
