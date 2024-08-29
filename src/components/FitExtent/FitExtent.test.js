import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure, shallow } from "enzyme";
import OLMap from "ol/Map";
import OLView from "ol/View";
import React from "react";
import renderer from "react-test-renderer";

import FitExtent from "./FitExtent";

configure({ adapter: new Adapter() });

const extent = [1, 2, 3, 4];

test("Button should match snapshot.", () => {
  const map = new OLMap({});
  const component = renderer.create(
    <FitExtent extent={extent} map={map}>
      FitExtent
    </FitExtent>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Should fit the extent.", () => {
  const map = new OLMap({ view: new OLView({ center: [0, 0], zoom: 7 }) });
  const wrapper = shallow(
    <FitExtent className="fit-ext" extent={extent} map={map}>
      FitExtent
    </FitExtent>,
  );
  wrapper.find(".fit-ext").first().simulate("click", {});
  const calculatedExtent = map.getView().calculateExtent(map.getSize());

  expect(calculatedExtent).toStrictEqual([1, 2, 3, 4]);
});

test("Should fit the extent on return.", () => {
  const map = new OLMap({ view: new OLView({ center: [0, 0], zoom: 7 }) });
  const wrapper = shallow(
    <FitExtent className="fit-ext" extent={extent} map={map}>
      FitExtent
    </FitExtent>,
  );
  wrapper.find(".fit-ext").first().simulate("click", { which: 13 });
  const calculatedExtent = map.getView().calculateExtent(map.getSize());

  expect(calculatedExtent).toStrictEqual([1, 2, 3, 4]);
});
