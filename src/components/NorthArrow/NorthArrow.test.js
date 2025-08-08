import { act, render } from "@testing-library/react";
import "jest-canvas-mock";
import OLMap from "ol/Map";
import MapEvent from "ol/MapEvent";
import OLView from "ol/View";
import React from "react";
import { TiImage } from "react-icons/ti";

import NorthArrow from "./NorthArrow";

let olView;
let olMap;

describe("NorthArrow", () => {
  beforeEach(() => {
    olView = new OLView();
    olMap = new OLMap({ view: olView });
  });

  test("should match snapshot with default value.", () => {
    const { container } = render(<NorthArrow map={olMap} />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should match snapshot with custom attributes.", () => {
    const { container } = render(
      <NorthArrow className="test-class" map={olMap} tabIndex={0} />,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should match snapshot with children.", () => {
    const { container } = render(
      <NorthArrow map={olMap}>
        <TiImage />
      </NorthArrow>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should match snapshot with children.", () => {
    const { container } = render(
      <NorthArrow map={olMap}>
        <TiImage />
      </NorthArrow>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should match snapshot rotated.", () => {
    const { container } = render(
      <NorthArrow map={olMap} rotationOffset={45} />,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should match snapshot with circle.", () => {
    const { container } = render(<NorthArrow circled map={olMap} />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should react on view rotation (transform: `rotate(20deg)`)", () => {
    const { container } = render(<NorthArrow map={olMap} />);
    // Trigger view rotation
    olMap.getView().setRotation(0.3490658503988659);
    act(() => {
      olMap.dispatchEvent(new MapEvent("postrender", olMap));
      // 20 degrees = 0.3490658503988659 radians
    });
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should react on view rotation with offset (transform: `rotate(10deg)`)", () => {
    const { container } = render(
      <NorthArrow map={olMap} rotationOffset={-10} />,
    );
    olMap.getView().setRotation(0.3490658503988659);
    act(() => {
      olMap.dispatchEvent(new MapEvent("postrender", olMap));
    });
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should remove post render event on unmount", () => {
    const { unmount } = render(<NorthArrow map={olMap} rotationOffset={-10} />);
    // eslint-disable-next-line no-underscore-dangle
    expect(olMap.listeners_.postrender.length).toBe(4);
    unmount();
    // eslint-disable-next-line no-underscore-dangle
    expect(olMap.listeners_.postrender.length).toBe(3);
  });
});
