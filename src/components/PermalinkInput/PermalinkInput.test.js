import React from 'react';
import 'babel-polyfill';
import flushPromises from 'flush-promises';
import { configure, shallow } from 'enzyme';
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

    test('Promise resolution set state permalinkValue.', async () => {
      const wrapper = shallow(
        <PermalinkInput getShortenedUrl={getShortenedUrl} />,
      );
      wrapper.setProps({ value: 'http://url.test' });
      await flushPromises();
      wrapper.update();
      const input = wrapper
        .find('input')
        .first()
        .getElement();

      expect(input.props.value).toBe('http://url.test');
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

    test('select value on input click.', async () => {
      PermalinkInput.selectInput = jest.fn();
      const wrapper = shallow(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );
      const spy = jest.spyOn(PermalinkInput, 'selectInput');
      await flushPromises();
      wrapper.update();
      wrapper
        .find('input')
        .first()
        .simulate('click');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('click button copy the value.', async () => {
      document.execCommand = jest.fn();
      const wrapper = shallow(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );
      const spy = jest.spyOn(wrapper.instance(), 'onClickCopyButton');
      await flushPromises();
      wrapper.update();
      wrapper
        .find('.tm-permalink-bt')
        .first()
        .simulate('click');

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
