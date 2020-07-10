import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import ResizeObserver from 'resize-observer-polyfill';
import { Resizable } from 're-resizable';
import Overlay from './Overlay';

jest.mock('resize-observer-polyfill');

configure({ adapter: new Adapter() });

const propTypes = {
  isMobileResizable: PropTypes.bool,
  thresholdWidthForMobile: PropTypes.number,
};

const defaultProps = {
  isMobileResizable: undefined,
  thresholdWidthForMobile: undefined,
};

const BasicComponent = ({ thresholdWidthForMobile, isMobileResizable }) => {
  const [ref, setRef] = useState(null);

  return (
    <>
      <div
        ref={(node) => {
          if (node !== ref) {
            setRef(node);
          }
        }}
        className="observer"
      />
      <Overlay
        observe={ref}
        thresholdWidthForMobile={thresholdWidthForMobile}
        isMobileResizable={isMobileResizable}
      >
        Test content
      </Overlay>
    </>
  );
};
BasicComponent.propTypes = propTypes;
BasicComponent.defaultProps = defaultProps;

describe('Overlay', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(<Overlay>Test content</Overlay>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should react on observe resize.', () => {
    const wrapper = mount(<BasicComponent />);
    const target = wrapper.find('.observer').getDOMNode();

    act(() => {
      // The mock class set the onResize property, we just have to run it to
      // simulate a resize
      ResizeObserver.onResize([
        {
          target,
          contentRect: {
            width: 200,
            height: 200,
          },
        },
      ]);
    });
    wrapper.update();

    expect(wrapper.find('.tm-overlay').length > 0).toBe(false);
    expect(wrapper.find('.tm-overlay-mobile').length > 0).toBe(true);
  });

  test('should force mobile overlay display on big screen.', () => {
    const wrapper = mount(
      <BasicComponent thresholdWidthForMobile={Infinity} />,
    );
    const target = wrapper.find('.observer').getDOMNode();

    act(() => {
      ResizeObserver.onResize([
        {
          target,
          contentRect: {
            width: 1200,
            height: 200,
          },
        },
      ]);
    });
    wrapper.update();

    expect(wrapper.find('.tm-overlay').length > 0).toBe(false);
    expect(wrapper.find('.tm-overlay-mobile').length > 0).toBe(true);
  });

  test('should allow resizing with top handler on mobile.', () => {
    const wrapper = mount(<BasicComponent />);
    const target = wrapper.find('.observer').getDOMNode();

    // Force resize to make it mobile.
    act(() => {
      ResizeObserver.onResize([
        {
          target,
          contentRect: {
            width: 200,
            height: 200,
          },
        },
      ]);
    });
    wrapper.update();

    const resizableProps = wrapper.find(Resizable).props();

    expect(resizableProps.enable.top).toBe(true);
  });

  test('should not allow resizing with top handler on mobile.', () => {
    const wrapper = mount(<BasicComponent isMobileResizable={false} />);
    const target = wrapper.find('.observer').getDOMNode();

    // Force resize to make it mobile.
    act(() => {
      ResizeObserver.onResize([
        {
          target,
          contentRect: {
            width: 200,
            height: 200,
          },
        },
      ]);
    });
    wrapper.update();

    const resizableProps = wrapper.find(Resizable).props();

    expect(resizableProps.enable.top).toBe(false);
  });
});
