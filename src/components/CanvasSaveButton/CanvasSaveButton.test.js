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
    target.style.width = '100px';
    target.style.height = '100px';
    document.body.appendChild(target);
    olMap = new Map({
      target,
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
  });

  afterEach(() => {
    document.body.removeChild(olMap.getTargetElement());
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

  test('Should split too long copyright into two lines.', async done => {
    const wrapper = shallow(
      <CanvasSaveButton
        className="ta-example"
        title={conf.title}
        map={olMap}
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
    global.URL.createObjectURL = jest.fn();
    const spy = jest.spyOn(CanvasSaveButton.prototype, 'splitCopyrightLine');
    await wrapper.find('.ta-example').simulate('click');
    await olMap.dispatchEvent(
      new RenderEvent('rendercomplete', undefined, undefined, {
        canvas: document.createElement('canvas'),
      }),
    );
    await window.setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
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
      >
        {conf.icon}
      </CanvasSaveButton>,
    );
    global.URL.createObjectURL = jest.fn();
    const spy = jest.spyOn(CanvasSaveButton.prototype, 'createCanvasImage');
    await wrapper.find('.ta-example').simulate('click');
    await olMap.dispatchEvent(
      new RenderEvent('rendercomplete', undefined, undefined, {
        canvas: document.createElement('canvas'),
      }),
    );
    await window.setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(saveStart).toHaveBeenCalledTimes(1);
      expect(saveEnd).toHaveBeenCalledTimes(1);
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
    canvas.msToBlob = jest.fn();
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
    canvas.msToBlob = undefined;
  });
});
