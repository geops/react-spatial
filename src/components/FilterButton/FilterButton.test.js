import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MdFilterList } from 'react-icons/md';
import { TrajservLayer } from 'mobility-toolbox-js/src/ol/';
import FilterButton from '.';

configure({ adapter: new Adapter() });
const trackerLayer = new TrajservLayer();

test('FollowButton should match snapshot.', () => {
  const component = renderer.create(
    <FilterButton
      className="rt-filter-button"
      title="Filter up"
      active={false}
      onClick={() => {}}
      routeIdentifier="test"
      trackerLayer={trackerLayer}
    >
      <MdFilterList />
    </FilterButton>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('FollowButton should toggle.', () => {
  let filterActive = false;
  const setFilterActive = () => {
    filterActive = !filterActive;
  };
  const bt = shallow(
    <FilterButton
      className="rt-filter-button"
      routeIdentifier="test"
      active={filterActive}
      onClick={(active) => setFilterActive(active)}
      trackerLayer={trackerLayer}
    >
      <MdFilterList />
    </FilterButton>,
  );

  expect(filterActive).toBe(false);

  bt.find('.rt-filter-button').first().simulate('click');

  expect(filterActive).toBe(true);

  bt.find('.rt-filter-button').first().simulate('click');

  expect(filterActive).toBe(false);
});
