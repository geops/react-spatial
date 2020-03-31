import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MapEvent from 'ol/MapEvent';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import { TiImage } from 'react-icons/ti';
import NorthArrow from './NorthArrow';

configure({ adapter: new Adapter() });
let olView;
let olMap;

describe('NorthArrow', () => {
  beforeEach(() => {
    olView = new OLView();
    olMap = new OLMap({ view: olView });
  });

  test('should match snapshot with default value.', () => {
    let component;
    renderer.act(() => {
      component = renderer.create(<NorthArrow map={olMap} />);
    });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with custom attributes.', () => {
    let component;
    renderer.act(() => {
      component = renderer.create(
        <NorthArrow map={olMap} className="test-class" tabIndex={0} />,
      );
    });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with children.', () => {
    let component;
    renderer.act(() => {
      component = renderer.create(
        <NorthArrow map={olMap}>
          <TiImage />
        </NorthArrow>,
      );
    });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot rotated.', () => {
    let component;
    renderer.act(() => {
      component = renderer.create(
        <NorthArrow map={olMap} rotationOffset={45} />,
      );
    });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with circle.', () => {
    let component;
    renderer.act(() => {
      component = renderer.create(<NorthArrow circled map={olMap} />);
    });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should react on view rotation (transform: `rotate(20deg)`)', () => {
    const wrapper = mount(<NorthArrow map={olMap} />);
    // Trigger view rotation
    olMap.getView().setRotation(0.3490658503988659);
    act(() => {
      olMap.dispatchEvent(new MapEvent('postrender', olMap));
      // 20 degrees = 0.3490658503988659 radians
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('should react on view rotation with offset (transform: `rotate(10deg)`)', () => {
    const wrapper = mount(<NorthArrow map={olMap} rotationOffset={-10} />);
    olMap.getView().setRotation(0.3490658503988659);
    act(() => {
      olMap.dispatchEvent(new MapEvent('postrender', olMap));
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('should remove post render event on unmount', () => {
    const wrapper = mount(<NorthArrow map={olMap} rotationOffset={-10} />);
    // eslint-disable-next-line no-underscore-dangle
    expect(olMap.listeners_.postrender.length).toBe(3);
    wrapper.unmount();
    // eslint-disable-next-line no-underscore-dangle
    expect(olMap.listeners_.postrender.length).toBe(2);
  });
});
