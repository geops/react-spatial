import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import { TiImage } from 'react-icons/ti';
import RenderEvent from 'ol/render/Event';
import CanvasSaveButton from './CanvasSaveButton';

configure({ adapter: new Adapter() });

describe('CanvasSaveButton', () => {
  const conf = {
    title: 'Karte als Bild speichern.',
    icon: <TiImage focusable={false} />,
    className: 'ta-example',
    saveFormat: 'image/jpeg',
  };
  const olView = new OLView({});
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

  test('should be trigger click function.', async () => {
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
    const spy = jest
      .spyOn(CanvasSaveButton.prototype, 'downloadCanvasImage')
      .mockReturnValue(Promise.resolve(olMap));
    const spy1 = jest.spyOn(CanvasSaveButton.prototype, 'onBeforeSave');
    const spy2 = jest.spyOn(CanvasSaveButton.prototype, 'onAfterSave');

    await wrapper.find('.ta-example').simulate('click');
    await olMap.dispatchEvent(
      new RenderEvent('rendercomplete', undefined, undefined, {
        canvas: document.createElement('canvas'),
      }),
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });
});
