import { render } from "@testing-library/react";
import "jest-canvas-mock";
import OLMap from "ol/Map";
import OLView from "ol/View";
import React from "react";

import ScaleLine from "./ScaleLine";

describe("ScaleLine", () => {
  test("matches snapshot", () => {
    const map = new OLMap({ view: new OLView({ center: [0, 0], zoom: 7 }) });
    const component = render(<ScaleLine map={map} />);
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  test("remove control on unmount.", () => {
    const map = new OLMap({ controls: [] });
    const spy = jest.spyOn(map, "removeControl");
    const spy2 = jest.spyOn(map, "addControl");
    const { unmount } = render(<ScaleLine map={map} />);
    expect(spy).toHaveBeenCalledTimes(0);
    unmount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(spy2.mock.calls[0][0]);
  });
});
