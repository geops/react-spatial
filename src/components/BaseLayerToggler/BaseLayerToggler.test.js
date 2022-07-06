/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import OLMap from 'ol/Map';
import { fireEvent, render, screen } from '@testing-library/react';
import { Layer } from 'mobility-toolbox-js/ol';
import BaseLayerToggler from './BaseLayerToggler';
import LayerService from '../../LayerService';

const shallowComp = (layers, props) => {
  const map = new OLMap({});
  const layerService = new LayerService(layers);
  return render(
    <BaseLayerToggler
      layerService={layerService}
      map={map}
      {...(props || {})}
    />,
  );
};
const mountComp = (layers, props) => {
  const map = new OLMap({});
  const layerService = new LayerService(layers);
  return render(
    <BaseLayerToggler
      layerService={layerService}
      map={map}
      {...(props || {})}
    />,
  );
};

const expectSnapshot = (layers, props) => {
  const map = new OLMap({});
  const layerService = new LayerService(layers);
  const { container } = render(
    <BaseLayerToggler
      layerService={layerService}
      map={map}
      {...(props || {})}
    />,
  );
  expect(container.innerHTML).toMatchSnapshot();
};

describe('BaseLayerToggler', () => {
  let layers;

  beforeEach(() => {
    layers = [
      new Layer({
        name: 'bl1',
        isBaseLayer: true,
      }),
      new Layer({
        name: 'bl2',
        isBaseLayer: true,
        visible: false,
      }),
      new Layer({
        name: 'bl3',
        isBaseLayer: true,
        visible: false,
      }),
    ];
  });
  describe('matches snapshots', () => {
    test('using default properties.', () => {
      expectSnapshot(layers);
    });
  });

  test('initialize correctly the state', () => {
    shallowComp(layers);
    expect(layers[0].visible).toBe(true);
  });

  test('goes forward through all available layer except the current layer displayed on the map.', async () => {
    const { container } = shallowComp(layers);
    expect(layers[0].visible).toBe(true);
    await fireEvent.click(
      container.querySelector('.rs-base-layer-toggle-button'),
    );
    expect(layers[1].visible).toBe(true);

    // Layer at index 0 is displayed on the map so we must ignore it
    await fireEvent.click(container.querySelector('.rs-base-layer-next'));
    await fireEvent.click(
      container.querySelector('.rs-base-layer-toggle-button'),
    );
    expect(layers[2].visible).toBe(true);

    await fireEvent.click(container.querySelector('.rs-base-layer-next'));
    await fireEvent.click(
      container.querySelector('.rs-base-layer-toggle-button'),
    );
    expect(layers[0].visible).toBe(true);
  });

  test('goes backward through all available layer except the current layer displayed on the map.', async () => {
    const { container } = shallowComp(layers);
    expect(layers[0].visible).toBe(true);

    // Layer at index 0 is displayed on the map so we must ignore it
    await fireEvent.click(container.querySelector('.rs-base-layer-previous'));
    await fireEvent.click(
      container.querySelector('.rs-base-layer-toggle-button'),
    );
    expect(layers[2].visible).toBe(true);

    await fireEvent.click(container.querySelector('.rs-base-layer-next'));
    await fireEvent.click(
      container.querySelector('.rs-base-layer-toggle-button'),
    );
    expect(layers[1].visible).toBe(true);
  });

  test('hide baseLayerToggler if only one baselayer', () => {
    const { container } = mountComp([layers[0]]);
    expect(container.innerHTML).toBe('');
  });

  test('should use children', () => {
    shallowComp(layers, {
      prevButtonContent: 'prev',
      nextButtonContent: 'next',
    });

    expect(screen.getByText('next')).not.toBeNull();
    expect(screen.getByText('prev')).not.toBeNull();
  });
});
