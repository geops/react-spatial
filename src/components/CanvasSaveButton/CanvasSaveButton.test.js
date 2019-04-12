import canvasSerializer from 'jest-canvas-snapshot-serializer';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import { TiImage } from 'react-icons/ti';
import CanvasSaveButton from './CanvasSaveButton';

expect.addSnapshotSerializer(canvasSerializer);

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

  const createButton = extraData => {
    const component = mount(
      <CanvasSaveButton
        className="ta-example"
        title={conf.title}
        map={olMap}
        extraData={extraData}
      >
        {conf.icon}
      </CanvasSaveButton>,
    );

    return component.instance();
  };

  const mockCanvas = () => {
    const elem = document.createElement('canvas');
    elem.width = 902;
    elem.height = 452;
    return elem.getContext('2d').canvas;
  };

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

  test('should export extent', () => {
    const instance = createButton();

    // Mock clip
    // as map.getPixelFromCoordinate does not work in the tests
    instance.options.clip = {
      x: 160.50000681958807,
      y: 25.5000410251252,
      w: 581,
      h: 400,
    };

    const canvas = mockCanvas();

    return instance.createCanvas(canvas, instance.options).then(destCanvas => {
      expect(destCanvas).toMatchSnapshot();
    });
  });

  describe('Extra data - canvas overlays', () => {
    test('copyright text as text', () => {
      const instance = createButton({
        copyright: {
          text: 'Test Copyright',
        },
      });
      const canvas = mockCanvas();

      return instance
        .createCanvas(canvas, instance.options)
        .then(destCanvas => {
          expect(destCanvas).toMatchSnapshot();
        });
    });

    test('copyright text as function', () => {
      const instance = createButton({
        copyright: {
          text: () => {
            return 'Test copyright as function';
          },
        },
      });
      const canvas = mockCanvas();

      return instance
        .createCanvas(canvas, instance.options)
        .then(destCanvas => {
          expect(destCanvas).toMatchSnapshot();
        });
    });

    test('copyright font', () => {
      const instance = createButton({
        copyright: {
          text: 'Test Copyright',
          font: '10px sans-serif',
        },
      });
      const canvas = mockCanvas();

      return instance
        .createCanvas(canvas, instance.options)
        .then(destCanvas => {
          expect(destCanvas).toMatchSnapshot();
        });
    });

    test('copyright fillStyle', () => {
      const instance = createButton({
        copyright: {
          text: 'Test Copyright',
          fillStyle: 'blue',
        },
      });
      const canvas = mockCanvas();

      return instance
        .createCanvas(canvas, instance.options)
        .then(destCanvas => {
          expect(destCanvas).toMatchSnapshot();
        });
    });
  });
});
