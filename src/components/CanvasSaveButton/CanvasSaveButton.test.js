import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import { TiImage } from 'react-icons/ti';
import CanvasSaveButton from './CanvasSaveButton';

configure({ adapter: new Adapter() });

describe('CanvasSaveButton', () => {
  const conf = {
    title: 'Karte als Bild speichern.',
    icon: <TiImage focusable={false} />,
    className: 'ta-example',
    saveFormat: 'image/jpeg',
  };
  const olView = new OLView();
  const olMap = new OLMap({ view: olView });

  test('should match snapshot.', () => {
    const component = renderer.create(
      <CanvasSaveButton
        title={conf.title}
        saveFormat={conf.saveFormat}
        map={olMap}
      >
        {conf.icon}
      </CanvasSaveButton>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should be trigger click function.', () => {
    const wrapper = shallow(
      <CanvasSaveButton
        className="ta-example"
        title={conf.title}
        saveFormat={conf.saveFormat}
        map={olMap}
      >
        {conf.icon}
      </CanvasSaveButton>,
    );
    const spy = jest.spyOn(CanvasSaveButton.prototype, 'downloadCanvasImage');

    wrapper.find('.ta-example').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
