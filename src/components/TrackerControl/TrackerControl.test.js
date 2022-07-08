import React from 'react';
import renderer from 'react-test-renderer';
import { TralisLayer as TrackerLayer } from 'mobility-toolbox-js/ol';
import TrackerControl from '.';

describe('TrackerControl', () => {
  test('matches snapshots.', () => {
    const trackerLayer = new TrackerLayer();
    const component = renderer.create(
      <TrackerControl trackerLayer={trackerLayer} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
