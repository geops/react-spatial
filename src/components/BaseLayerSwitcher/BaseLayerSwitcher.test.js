/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import renderer from 'react-test-renderer';
import ConfigReader from '../../ConfigReader';
import data from '../../../data/TreeData';
import BaseLayerSwitcher from './BaseLayerSwitcher';

configure({ adapter: new Adapter() });

const shallowComp = (newData, props) => {
  const layers = ConfigReader.readConfig(newData || data);
  const component = renderer.create(
    <BaseLayerSwitcher layers={[layers[0]]} {...(props || {})} />,
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
