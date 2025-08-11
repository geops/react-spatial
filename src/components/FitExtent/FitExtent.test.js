import { fireEvent, render } from "@testing-library/react";
import OLMap from "ol/Map";
import OLView from "ol/View";
import React from "react";

import FitExtent from "./FitExtent";

const extent = [1, 2, 3, 4];

test("Button should match snapshot.", () => {
  const map = new OLMap({});
  const { container } = render(
    <FitExtent extent={extent} map={map}>
      FitExtent
    </FitExtent>,
  );
  expect(container.innerHTML).toMatchSnapshot();
});

test("Should fit the extent.", () => {
  const map = new OLMap({ view: new OLView({ center: [0, 0], zoom: 7 }) });
  const { container } = render(
    <FitExtent className="fit-ext" extent={extent} map={map}>
      FitExtent
    </FitExtent>,
  );
  fireEvent.click(container.querySelector(".fit-ext"));
  const calculatedExtent = map.getView().calculateExtent(map.getSize());

  expect(calculatedExtent).toStrictEqual([1, 2, 3, 4]);
});

test("Should fit the extent on return.", () => {
  const map = new OLMap({ view: new OLView({ center: [0, 0], zoom: 7 }) });
  const { container } = render(
    <FitExtent className="fit-ext" extent={extent} map={map}>
      FitExtent
    </FitExtent>,
  );
  fireEvent.click(container.querySelector(".fit-ext"), {
    which: 13,
  });
  const calculatedExtent = map.getView().calculateExtent(map.getSize());
  expect(calculatedExtent).toStrictEqual([1, 2, 3, 4]);
});
