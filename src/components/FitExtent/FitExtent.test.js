import React from 'react';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OLView from 'ol/View';
import OLMap from 'ol/Map';
import FitExtent from './FitExtent';

configure({ adapter: new Adapter() });

const extent = [1, 2, 3, 4];

test('Button should match snapshot.', () => {
  const map = new OLMap({});
  const component = renderer.create(<FitExtent map={map} extent={extent} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should fit the extent.', () => {
  const map = new OLMap({ view: new OLView({ zoom: 7, center: [0, 0] }) });
  const wrapper = shallow(
    <FitExtent map={map} extent={extent} className="fit-ext" />,
  );
  wrapper
    .find('.fit-ext')
    .first()
    .simulate('click');
  const calculatedExtent = map.getView().calculateExtent(map.getSize());

  expect(calculatedExtent).toStrictEqual([
    0.13386161413143904,
    1.133861614131439,
    3.866138385868561,
    4.866138385868561,
  ]);
});
