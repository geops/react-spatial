/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import renderer from 'react-test-renderer';
import OLMap from 'ol/Map';
import ConfigReader from '../../ConfigReader';
import LayerService from '../../LayerService';
import data from '../../../data/TreeData';
import BaseLayerSwitcher from './BaseLayerSwitcher';

configure({ adapter: new Adapter() });

const shallowComp = (newData, props) => {
  const map = new OLMap({});
  const layers = ConfigReader.readConfig(newData || data);
  const layerService = new LayerService(layers);
  const component = renderer.create(
    <BaseLayerSwitcher
      layerService={layerService}
      map={map}
      {...(props || {})}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
};

describe('BaseLayerToggler', () => {
  describe('matches snapshots', () => {
    test('using default properties.', () => {
      shallowComp();
    });
  });
});
