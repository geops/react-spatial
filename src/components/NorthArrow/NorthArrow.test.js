import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MapEvent from 'ol/MapEvent';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import { TiImage } from 'react-icons/ti';
import NorthArrow from './NorthArrow';

configure({ adapter: new Adapter() });

describe('NorthArrow', () => {
  const olView = new OLView();
  const olMap = new OLMap({ view: olView });

  test('should match snapshot simple.', () => {
    const component = renderer.create(
      <NorthArrow map={olMap} className="test-class" />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with children.', () => {
    const component = renderer.create(
      <NorthArrow map={olMap}>
        <TiImage />
      </NorthArrow>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot rotated.', () => {
    const component = renderer.create(
      <NorthArrow map={olMap} rotationOffset={45} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with circle.', () => {
    const component = renderer.create(<NorthArrow circled map={olMap} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should react on view rotation.', () => {
    const wrapper = shallow(<NorthArrow map={olMap} />);
    const spy = jest.spyOn(wrapper.instance(), 'onRotate');
    // Trigger view rotation
    olMap.getView().setRotation(0.3490658503988659);
    olMap.dispatchEvent(new MapEvent('postrender', olMap));

    expect(spy).toHaveBeenCalledTimes(1);
    // 20 degrees = 0.3490658503988659 radians
    expect(wrapper.instance().state.rotation).toBe(20);
  });

  test('should react on view rotation with offset.', () => {
    const wrapper = shallow(<NorthArrow map={olMap} rotationOffset={-10} />);
    const spy = jest.spyOn(wrapper.instance(), 'onRotate');

    olMap.getView().setRotation(0.3490658503988659);
    olMap.dispatchEvent(new MapEvent('postrender', olMap));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().state.rotation).toBe(10);
  });
});
