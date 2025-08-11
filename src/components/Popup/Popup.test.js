import "jest-canvas-mock";
import { fireEvent, render } from "@testing-library/react";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import OLMap from "ol/Map";
import View from "ol/View";
import React from "react";

import Popup from "./Popup";

let map;

const feat = new Feature({
  geometry: new Point([1000, 1000]),
});

describe("Popup", () => {
  beforeEach(() => {
    map = new OLMap({});
  });

  describe("should match snapshot", () => {
    test("without feature", () => {
      const { container } = render(
        <Popup map={map}>
          <div id="foo" />
        </Popup>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("with default values.", () => {
      const { container } = render(
        <Popup feature={feat} map={map}>
          <div id="foo" />
        </Popup>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("without close button.", () => {
      const { container } = render(
        <Popup
          feature={feat}
          map={map}
          renderCloseButton={() => {
            return null;
          }}
        >
          <div id="bar" />
        </Popup>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("without header.", () => {
      const { container } = render(
        <Popup
          feature={feat}
          map={map}
          renderHeader={() => {
            return null;
          }}
        >
          <div id="bar" />
        </Popup>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("with tabIndex defined.", () => {
      const { container } = render(
        <Popup feature={feat} map={map} tabIndex="0">
          <div id="bar" />
        </Popup>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  [
    ["click", {}],
    ["click", { which: 13 }],
  ].forEach((evt) => {
    test(`should trigger onCloseClick function on ${evt[0]} event.`, () => {
      const spy = jest.fn(() => {});

      const { container } = render(
        <Popup feature={feat} map={map} onCloseClick={spy}>
          <div id="gux" />
        </Popup>,
      );
      fireEvent[evt[0]](container.querySelector(".rs-popup-close-bt"), evt[1]);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test(`should trigger default onCloseClick function on ${evt[0]} event without errors.`, () => {
      const { container } = render(
        <Popup feature={feat} map={map}>
          <div id="gux" />
        </Popup>,
      );
      // test if no js error triggered by the default value
      try {
        fireEvent[evt[0]](
          container.querySelector(".rs-popup-close-bt"),
          evt[1],
        );
        expect(true).toBe(true);
      } catch (e) {
        expect(false).toBe(true);
      }
    });
  });

  describe(`init position`, () => {
    test(`using popupCoordinate.`, () => {
      map.getPixelFromCoordinate = jest.fn(() => {
        return [10010, 100200];
      });
      const { container } = render(
        <Popup map={map} popupCoordinate={[1001, 1002]}>
          <div id="gux" />
        </Popup>,
      );
      expect(container.firstChild.style.left).toBe("10010px");
      expect(container.firstChild.style.top).toBe("100200px");
    });

    test(`using feature.`, () => {
      map.getPixelFromCoordinate = jest.fn(() => {
        return [10010, 100200];
      });
      const { container } = render(
        <Popup feature={feat} map={map}>
          <div id="gux" />
        </Popup>,
      );
      expect(container.firstChild.style.left).toBe("10010px");
      expect(container.firstChild.style.top).toBe("100200px");
    });
  });

  describe(`#panIntoView`, () => {
    beforeEach(() => {
      const target = document.createElement("div");
      const { style } = target;
      style.position = "absolute";
      style.left = "-1000px";
      style.top = "-1000px";
      style.width = "100px";
      style.height = "100px";
      document.body.appendChild(target);

      map = new OLMap({
        target,
        view: new View({
          center: [1000, 1000],
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

    test(`animate the map.`, () => {
      map.getTarget().getBoundingClientRect = jest.fn(() => {
        return {
          bottom: -10,
          left: 5,
          right: -5,
          top: 5,
        };
      });
      map.getPixelFromCoordinate = jest.fn(() => {
        return [10, 20];
      });
      const spy = jest.spyOn(map.getView(), "animate");
      render(
        <Popup feature={feat} map={map} panIntoView>
          <div id="gux" />
        </Popup>,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        center: [1005, 990],
        duration: 500,
      });
    });

    test(`using panRect`, () => {
      map.getPixelFromCoordinate = jest.fn(() => {
        return [10, 200];
      });
      const spy = jest.spyOn(map.getView(), "animate");
      render(
        <Popup
          feature={feat}
          map={map}
          panIntoView
          panRect={{ bottom: -10, left: 0, right: 0, top: 0 }}
        >
          <div id="gux" />
        </Popup>,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        center: [1000, 990],
        duration: 500,
      });
    });

    test(`doesn't animate the map`, () => {
      map.getPixelFromCoordinate = jest.fn(() => {
        return [10, 200];
      });
      const spy = jest.spyOn(map.getView(), "animate");
      render(
        <Popup
          feature={feat}
          map={map}
          panIntoView
          panRect={{ bottom: 0, left: 0, right: 0, top: 0 }}
        >
          <div id="gux" />
        </Popup>,
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
