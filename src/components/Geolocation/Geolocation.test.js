import "jest-canvas-mock";
import { fireEvent, render } from "@testing-library/react";
import Map from "ol/Map";
import View from "ol/View";
import React from "react";

import Geolocation from "./Geolocation";

class CallbackHandler {
  static onActivate() {}

  static onDeactivate() {}

  static onError() {}

  static onSuccess() {}
}

describe("Geolocation", () => {
  let map;

  beforeEach(() => {
    const target = document.createElement("div");
    const { style } = target;
    style.position = "absolute";
    style.left = "-1000px";
    style.top = "-1000px";
    style.width = "100px";
    style.height = "100px";
    document.body.appendChild(target);

    map = new Map({
      target,
      view: new View({
        center: [0, 0],
        resolutions: [1],
        zoom: 0,
      }),
    });
    map.renderSync();
  });

  afterEach(() => {
    const target = map.getTarget();
    map.setTarget(null);
    if (target && target.parentNode) {
      target.parentNode.removeChild(target);
    }
    map.dispose();
  });

  describe("should match snapshot", () => {
    test("minimum props", () => {
      const { container } = render(<Geolocation map={map} />);
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("with title", () => {
      const { container } = render(
        <Geolocation map={map} title="Lokalisieren" />,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("with class name", () => {
      const { container } = render(
        <Geolocation className="my-class-name" map={map} />,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  test("should use children", () => {
    const { container } = render(<Geolocation map={map}>test</Geolocation>);

    const text = container.querySelector(".rs-geolocation").textContent;

    expect(text).toBe("test");
  });

  describe("button classes", () => {
    test("class should be active", () => {
      const { container } = render(<Geolocation map={map} />);
      const basic = container.querySelector(".rs-geolocation");

      fireEvent.click(basic);

      expect(basic.className).toBe("rs-geolocation rs-active");
    });

    test("class should not be active", () => {
      const { container } = render(<Geolocation map={map} />);
      const basic = container.querySelector(".rs-geolocation");

      fireEvent.click(basic);
      fireEvent.click(basic);

      expect(basic.className).toBe("rs-geolocation ");
    });
  });

  test(`success/activate/deactivate callback functions should be called`, () => {
    const spyOnSuccess = jest.spyOn(CallbackHandler, "onSuccess");
    const spyOnActivate = jest.spyOn(CallbackHandler, "onActivate");
    const spyOnDeactivate = jest.spyOn(CallbackHandler, "onDeactivate");

    const { container } = render(
      <Geolocation
        map={map}
        onActivate={() => {
          return CallbackHandler.onActivate();
        }}
        onDeactivate={() => {
          return CallbackHandler.onDeactivate();
        }}
        onSuccess={() => {
          return CallbackHandler.onSuccess();
        }}
      />,
    );

    fireEvent.click(container.querySelector(".rs-geolocation"));

    expect(spyOnActivate).toHaveBeenCalled();
    expect(spyOnSuccess).toHaveBeenCalled();

    fireEvent.click(container.querySelector(".rs-geolocation"));

    expect(spyOnDeactivate).toHaveBeenCalled();
  });

  // TODO fix
  test.skip(`error function should be called`, () => {
    const spy = jest.spyOn(CallbackHandler, "onError");

    global.navigator.geolocation.getCurrentPosition = jest.fn(() => {
      throw new Error("Geolocation error");
    });
    const { container } = render(
      <Geolocation
        map={map}
        onError={() => {
          return CallbackHandler.onError();
        }}
      />,
    );

    fireEvent.click(container.querySelector(".rs-geolocation"));

    expect(spy).toHaveBeenCalled();
  });

  describe("map centering", () => {
    test("centers map", () => {
      const center1 = [742952.8821531708, 6330118.608483334];
      map.getView().setCenter(center1);

      const { container } = render(<Geolocation map={map} />);
      const button = container.querySelector(".rs-geolocation");
      fireEvent.click(button);
      const center2 = map.getView().getCenter();
      expect(center1).not.toEqual(center2);
    });
  });
});
