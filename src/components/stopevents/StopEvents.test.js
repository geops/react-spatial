import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import StopEvents from './StopEvents';

jest.mock('resize-observer-polyfill');

configure({ adapter: new Adapter() });

// eslint-disable-next-line  react/prefer-stateless-function
class BasicComponent extends React.Component {
  render() {
    return (
      <div id="basic">
        <StopEvents observe={this} />
      </div>
    );
  }
}
// eslint-disable-next-line  react/prefer-stateless-function,react/no-multi-comp
class BasicComponent2 extends React.Component {
  render() {
    return (
      <div id="basic2">
        <StopEvents observe="#basic2" />
      </div>
    );
  }
}
// eslint-disable-next-line  react/prefer-stateless-function, react/no-multi-comp
class BasicComponent3 extends React.Component {
  render() {
    return (
      <div id="basic">
        <StopEvents
          observe={this}
          events={['contextmenu']}
        />
      </div>
    );
  }
}

// eslint-disable-next-line  react/prefer-stateless-function
// eslint-disable-next-line react/no-multi-comp
class BasicComponent4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: null,
    };
  }

  render() {
    const { ref } = this.state;
    return (
      <div
        id="basic4"
        ref={(node) => {
          if (node && !ref) {
            this.setState({ ref: node });
          }
        }}
      >
        <StopEvents observe={ref} />
      </div>
    );
  }
}

describe('StopEvents', () => {
  describe('when observe property is set to a React Component', () => {
    test('(un)observes it on (un)mount', () => {
      const spy = jest.spyOn(StopEvents.prototype, 'updateNodes');
      const spy2 = jest.spyOn(StopEvents.prototype, 'addListeners');
      const spy3 = jest.spyOn(StopEvents.prototype, 'removeListeners');
      const wrapper = mount(<BasicComponent />);
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).not.toHaveBeenCalled();
      spy.mockReset();
      spy2.mockReset();
      spy3.mockReset();
      wrapper.unmount();
      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      spy.mockRestore();
      spy2.mockRestore();
      spy3.mockRestore();
    });
  });

  describe('when observe property is set to a query selector', () => {
    test('(un)observes it on (un)mount', () => {
      const spy = jest.spyOn(StopEvents.prototype, 'updateNodes');
      const spy2 = jest.spyOn(StopEvents.prototype, 'addListeners');
      const spy3 = jest.spyOn(StopEvents.prototype, 'removeListeners');
      const wrapper = mount(<BasicComponent2 />);
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).not.toHaveBeenCalled();
      spy.mockReset();
      spy2.mockReset();
      spy3.mockReset();
      wrapper.unmount();
      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      spy.mockRestore();
      spy2.mockRestore();
      spy3.mockRestore();
    });
  });

  describe('when observe property is an HTMLElement.', () => {
    test('(un)observes it on (un)mount/update', () => {
      const spy = jest.spyOn(StopEvents.prototype, 'updateNodes');
      const spy2 = jest.spyOn(StopEvents.prototype, 'addListeners');
      const spy3 = jest.spyOn(StopEvents.prototype, 'removeListeners');
      const wrapper = mount(<BasicComponent4 />);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy2).toHaveBeenCalledTimes(2);
      expect(spy3).toHaveBeenCalledTimes(1);
      spy.mockReset();
      spy2.mockReset();
      spy3.mockReset();
      wrapper.unmount();
      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      spy.mockRestore();
      spy2.mockRestore();
      spy3.mockRestore();
    });
  });

  describe('stop progation of events', () => {
    test('calling evt.stopPropagation', () => {
      const stop = jest.fn();
      const evt = new CustomEvent('pointerdown');
      evt.stopPropagation = stop;
      const wrapper = mount(<BasicComponent />);
      const basic = wrapper.getDOMNode();
      basic.dispatchEvent(evt);
      expect(stop).toHaveBeenCalledTimes(1);
    });

    test('calling evt.nativeEvent.stopPropagation', () => {
      const stop = jest.fn();
      const evt = new CustomEvent('pointerdown');
      evt.stopPropagation = stop;
      evt.nativeEvent = {
        stopImmediatePropagation: stop,
      };
      const wrapper = mount(<BasicComponent />);
      const basic = wrapper.getDOMNode();
      basic.dispatchEvent(evt);
      expect(stop).toHaveBeenCalledTimes(2);
    });

    test('removing tm-pointer class', () => {
      document.body.classList.add('tm-pointer');
      const evt = new CustomEvent('pointerdown');
      const wrapper = mount(<BasicComponent />);
      const basic = wrapper.getDOMNode();
      expect(document.body.classList.contains('tm-pointer')).toBe(true);
      basic.dispatchEvent(evt);
      expect(document.body.classList.contains('tm-pointer')).toBe(false);
    });

    test('calling stopPropagation on events from props.events', () => {
      const stop = jest.fn();
      const evt = new CustomEvent('contextmenu');
      evt.stopPropagation = stop;
      const wrapper = mount(<BasicComponent3 />);
      const basic = wrapper.getDOMNode();
      basic.dispatchEvent(evt);
      expect(stop).toHaveBeenCalledTimes(1);
    });
  });
});
