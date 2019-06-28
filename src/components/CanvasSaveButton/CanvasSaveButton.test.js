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

  test('should call onSaveBefore then download then onSaveEnd function on click.', done => {
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
    const canvas = document.createElement('canvas');
    canvas.toBlob = jest.fn();
    const p = new Promise(resolve => {
      resolve(canvas);
    });
    const spy = jest
      .spyOn(CanvasSaveButton.prototype, 'createCanvasImage')
      .mockReturnValue(p);

    wrapper.find('.ta-example').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(saveStart).toHaveBeenCalledTimes(1);
    p.then(() => {
      expect(canvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
      );
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
