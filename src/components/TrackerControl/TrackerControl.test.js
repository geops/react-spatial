import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TrajservLayer from '../../layers/TrajservLayer';
import TrackerControl from '.';

configure({ adapter: new Adapter() });

describe('TrackerControl', () => {
  test('matches snapshots.', () => {
    const trackerLayer = new TrajservLayer();
    const component = renderer.create(
      <TrackerControl trackerLayer={trackerLayer} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
