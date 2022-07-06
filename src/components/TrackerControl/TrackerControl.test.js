import React from 'react';
import renderer from 'react-test-renderer';
import { TrajservLayer } from 'mobility-toolbox-js/ol';
import TrackerControl from '.';

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
