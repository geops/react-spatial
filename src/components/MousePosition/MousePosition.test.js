/* eslint-disable react/jsx-props-no-spreading */
import { fireEvent, render } from "@testing-library/react";
import "jest-canvas-mock";
import OLMousePosition from "ol/control/MousePosition";
import OLMap from "ol/Map";
import React from "react";

import MousePosition from "./MousePosition";

const expectSnapshot = (props) => {
  const map = new OLMap({});
  const { container } = render(<MousePosition map={map} {...props} />);
  expect(container.innerHTML).toMatchSnapshot();
};

describe("MousePosition", () => {
  describe("matches snapshots", () => {
    test("using default values.", () => {
      expectSnapshot({});
    });

    test("using no projections.", () => {
      expectSnapshot({
        projections: [],
      });
    });

    test("using only one projection", () => {
      expectSnapshot({
        projections: [{ label: "foo", value: "foo" }],
      });
    });

    test("using multiple projections.", () => {
      expectSnapshot({
        projections: [
          { label: "foo", value: "foo" },
          { label: "bar", value: "bar" },
        ],
      });
    });
  });

  test("add MousePosition control to the map.", () => {
    const map = new OLMap({});
    const spy = jest.spyOn(map, "removeControl");
    const spy2 = jest.spyOn(map, "addControl");
    const fn = jest.fn();
    render(
      <MousePosition
        map={map}
        projections={[
          {
            format: fn,
            label: "EPSG:4326",
            value: "EPSG:4326",
          },
        ]}
      />,
    );
    const ctrl = spy2.mock.calls[0][0];
    expect(spy).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(ctrl).toBeInstanceOf(OLMousePosition);
    expect(ctrl.getProjection().getCode()).toBe("EPSG:4326");
    expect(ctrl.getCoordinateFormat()).toBe(fn);
  });

  test("add/remove MousePosition control on mount/unmount.", () => {
    const map = new OLMap({});
    const spy = jest.spyOn(map, "removeControl");
    const spy2 = jest.spyOn(map, "addControl");
    const { unmount } = render(<MousePosition map={map} />);
    expect(spy).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(1);
    unmount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(spy2.mock.calls[0][0]);
  });

  test("triggers onChange when select projection.", () => {
    const map = new OLMap({});
    const onChange = jest.fn(() => {});
    const { container } = render(
      <MousePosition
        map={map}
        onChange={onChange}
        projections={[
          {
            format: jest.fn(),
            label: "EPSG:4326",
            value: "EPSG:4326",
          },
        ]}
      />,
    );
    // onChange triggered on instantiation.
    expect(onChange).toHaveBeenCalledTimes(0);
    fireEvent.change(container.querySelector("select"), {});
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("applies new format and value when we select a new projection.", () => {
    const map = new OLMap({});
    const spy = jest.spyOn(map, "addControl");
    const projs = [
      {
        format: jest.fn(),
        label: "EPSG:4326",
        value: "EPSG:4326",
      },
      {
        format: jest.fn(),
        label: "EPSG:3857",
        value: "EPSG:3857",
      },
    ];
    const { container } = render(
      <MousePosition map={map} projections={projs} />,
    );

    const ctrl = spy.mock.calls[0][0];
    expect(ctrl.getProjection().getCode()).toBe(projs[0].value);
    expect(ctrl.getCoordinateFormat()).toBe(projs[0].format);

    fireEvent.change(container.querySelector("select"), {
      target: { value: "EPSG:3857" },
    });
    expect(ctrl.getProjection().getCode()).toBe(projs[1].value);
    expect(ctrl.getCoordinateFormat()).toBe(projs[1].format);
  });
});
