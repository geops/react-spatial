import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Map from 'ol/Map';
import View from 'ol/View';
import { TiImage } from 'react-icons/ti';
import RenderEvent from 'ol/render/Event';
import CanvasSaveButton from './CanvasSaveButton';

configure({ adapter: new Adapter() });

describe('CanvasSaveButton', () => {
  let olMap;
  const conf = {
    title: 'Karte als Bild speichern.',
    icon: <TiImage focusable={false} />,
    className: 'ta-example',
    saveFormat: 'image/jpeg',
  };

  beforeEach(() => {
    const target = document.createElement('div');
    document.body.appendChild(target);
    target.style.width = '100px';
    target.style.height = '100px';
    olMap = new Map({
      target,
      controls: [],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
    olMap.getView().setCenter([1, 1]);
  });

  afterEach(() => {
    if (olMap.getTargetElement()) {
      document.body.removeChild(olMap.getTargetElement());
    }
    olMap.setTarget(null);
  });

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

  test('should call onSaveBefore then download then onSaveEnd function on click.', async done => {
    const saveStart = jest.fn();
    const saveEnd = jest.fn();
    const wrapper = shallow(
      <CanvasSaveButton
        className="ta-example"
        title={conf.title}
        map={olMap}
        saveFormat={conf.saveFormat}
        onSaveStart={saveStart}
        onSaveEnd={saveEnd}
        extraData={{
          copyright: {
            text: () => {
              return (
                'contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)' +
                'contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)' +
                'contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)' +
                'contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)' +
                'contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)' +
                'contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)' +
                'contributors, SRTM | map style: © OpenTopoMap (CC-BY-SA)'
              );
            },
          },
        }}
      >
        {conf.icon}
      </CanvasSaveButton>,
    );
    const link = { click: jest.fn() };
    const div = document.createElement('div');
    const canvas = document.createElement('canvas');
    canvas.toBlob = jest.fn(callback => callback());
    global.URL.createObjectURL = jest.fn(() => 'fooblob');
    // We use a spy here to be able to correctly restore the initial function
    const spy3 = jest
      .spyOn(global.document, 'createElement')
      .mockImplementation(elt => {
        if (elt === 'canvas') {
          return canvas;
        }
        if (elt === 'div') {
          return div;
        }
        if (elt === 'a') {
          return link;
        }
        return {};
      });
    const spy = jest.spyOn(CanvasSaveButton.prototype, 'createCanvasImage');
    const spy2 = jest.spyOn(CanvasSaveButton.prototype, 'downloadCanvasImage');
    const spy4 = jest.spyOn(CanvasSaveButton.prototype, 'splitCopyrightLine');
    jest
      .spyOn(olMap.getTargetElement(), 'getElementsByTagName')
      .mockReturnValue([canvas]);
    await wrapper.find('.ta-example').simulate('click');
    await olMap.dispatchEvent(
      new RenderEvent('rendercomplete', undefined, undefined, {
        canvas,
      }),
    );
    await window.setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(saveStart).toHaveBeenCalledTimes(1);
      expect(saveEnd).toHaveBeenCalledTimes(1);
      expect(spy2.mock.calls[0][0]).toBe(canvas);
      expect(spy2.mock.calls[0][0].toBlob).toHaveBeenCalledTimes(1);
      expect(link.href).toBe('fooblob');
      expect(link.download).toBe('.jpg');
      // TODO fix this test for click.
      // expect(link.click).toHaveBeenCalledTimes(1);
      expect(spy4).toHaveBeenCalledTimes(1);
      spy.mockRestore();
      spy2.mockRestore();
      spy3.mockRestore();
      spy4.mockRestore();
      done();
    });
  });

  test('stops click event propagation on ie.', () => {
    const wrapper = shallow(
      <CanvasSaveButton className="ta-example" title={conf.title} map={olMap}>
        {conf.icon}
      </CanvasSaveButton>,
    );

    const evt = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    window.navigator.msSaveBlob = true;

    const canvas = document.createElement('canvas');
    const p = new Promise(resolve => {
      resolve(canvas);
    });
    jest
      .spyOn(CanvasSaveButton.prototype, 'createCanvasImage')
      .mockReturnValue(p);

    wrapper.find('.ta-example').simulate('click', evt);
    expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
    expect(evt.preventDefault).toHaveBeenCalledTimes(1);

    window.navigator.msSaveBlob = false;
  });
});
