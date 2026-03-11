/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { act, fireEvent, render } from "@testing-library/react";
import OLMap from "ol/Map";
import MapEvent from "ol/MapEvent";
import OLView from "ol/View";
import React from "react";

import Zoom from "./Zoom";

describe("Zoom", () => {
  test("should match snapshot.", () => {
    const map = new OLMap({});
    const { container } = render(<Zoom map={map} />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should match snapshot with custom attributes", () => {
    const map = new OLMap({});
    const { container } = render(
      <Zoom className="foo" map={map} tabIndex={-1} title="bar" />,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should match snapshot with zoom slider", () => {
    const map = new OLMap({});
    const { container } = render(<Zoom map={map} zoomSlider />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  [
    ["click", {}],
    ["keypress", { which: 13 }],
  ].forEach((evt) => {
    test(`should zoom in on ${evt[0]}.`, () => {
      const map = new OLMap({ view: new OLView({ zoom: 5 }) });
      const { container } = render(<Zoom map={map} />);
      fireEvent.click(container.querySelector(".rs-zoom-in"));
      expect(map.getView().getZoom()).toBe(6);
    });

    test(`should zoom in on ${evt[0]} (delta: 0.3).`, () => {
      const map = new OLMap({ view: new OLView({ zoom: 5 }) });
      const { container } = render(<Zoom delta={0.3} map={map} />);
      fireEvent.click(container.querySelector(".rs-zoom-in"));
      expect(map.getView().getZoom()).toBe(5.3);
    });

    test(`should zoom out on ${evt[0]}.`, () => {
      const map = new OLMap({ view: new OLView({ zoom: 5 }) });
      const { container } = render(<Zoom map={map} />);
      fireEvent.click(container.querySelector(".rs-zoom-out"));
      expect(map.getView().getZoom()).toBe(4);
    });

    test(`should zoom out on ${evt[0]} (delta: 0.3).`, () => {
      const map = new OLMap({ view: new OLView({ zoom: 5 }) });
      const { container } = render(<Zoom delta={0.3} map={map} />);
      fireEvent.click(container.querySelector(".rs-zoom-out"));
      expect(map.getView().getZoom()).toBe(4.7);
    });
  });

  test("should remove zoomSlider control on unmount.", () => {
    const map = new OLMap({});
    const spy = jest.spyOn(map, "removeControl");
    const spy2 = jest.spyOn(map, "addControl");
    const { unmount } = render(<Zoom map={map} zoomSlider />);
    expect(spy).toHaveBeenCalledTimes(0);
    unmount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(spy2.mock.calls[0][0]);
  });

  test("should disable zoom-in button on mount with max zoom..", () => {
    const map = new OLMap({
      view: new OLView({ maxZoom: 20, zoom: 20 }),
    });
    const spy = jest.spyOn(map.getView(), "setZoom");
    const { container, rerender } = render(<Zoom map={map} />);
    act(() => {
      map.dispatchEvent(new MapEvent("moveend", map));
    });
    rerender(<Zoom map={map} />);
    expect(container.querySelector(".rs-zoom-in").disabled).toEqual(true);
    fireEvent.click(container.querySelector(".rs-zoom-in"));
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("should disable zoom-out button on mount with min zoom.", () => {
    const map = new OLMap({
      view: new OLView({ minZoom: 2, zoom: 2 }),
    });
    const spy = jest.spyOn(map.getView(), "setZoom");
    const { container, rerender } = render(<Zoom map={map} />);
    act(() => {
      map.dispatchEvent(new MapEvent("moveend", map));
    });
    rerender(<Zoom map={map} />);
    expect(container.querySelector(".rs-zoom-out").disabled).toEqual(true);
    fireEvent.click(container.querySelector(".rs-zoom-out"));
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

// eslint-disable-next-line mocha/no-global-tests
test("should disable zoom-out button when reaching min zoom.", () => {
  const map = new OLMap({
    view: new OLView({ minZoom: 2, zoom: 3 }),
  });
  const spy = jest.spyOn(map.getView(), "setZoom");
  const { container, rerender } = render(<Zoom map={map} />);
  fireEvent.click(container.querySelector(".rs-zoom-out"));
  expect(spy).toHaveBeenCalledTimes(1);
  act(() => {
    map.dispatchEvent(new MapEvent("moveend", map));
  });
  rerender(<Zoom map={map} />);
  expect(container.querySelector(".rs-zoom-out").disabled).toEqual(true);
});

// eslint-disable-next-line mocha/no-global-tests
test("should trigger callback functions.", () => {
  const map = new OLMap({
    view: new OLView({ minZoom: 2, zoom: 3 }),
  });
  const zoomIn = jest.fn();
  const zoomOut = jest.fn();
  const { container } = render(
    <Zoom
      map={map}
      onZoomInButtonClick={zoomIn}
      onZoomOutButtonClick={zoomOut}
    />,
  );
  fireEvent.click(container.querySelector(".rs-zoom-out"));
  expect(zoomOut).toHaveBeenCalledTimes(1);
  fireEvent.click(container.querySelector(".rs-zoom-in"));
  fireEvent.click(container.querySelector(".rs-zoom-in"));
  expect(zoomIn).toHaveBeenCalledTimes(2);
});
