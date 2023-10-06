import React from "react";
import renderer from "react-test-renderer";
import { configure, mount, shallow } from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import "jest-canvas-mock";

import OLMap from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Line from "ol/geom/LineString";
import Popup from "./Popup";

let map;

configure({ adapter: new Adapter() });

const feat = new Feature({
  geometry: new Point([1000, 1000]),
});

const featLine = new Feature({
  geometry: new Line([
    [1000, 1000],
    [2000, 2000],
  ]),
});

describe("Popup", () => {
  beforeEach(() => {
    map = new OLMap({});
  });

  describe("should match snapshot", () => {
    test("without feature", () => {
      const component = renderer.create(
        <Popup map={map}>
          <div id="foo" />
        </Popup>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test("with default values.", () => {
      const component = renderer.create(
        <Popup map={map} feature={feat}>
          <div id="foo" />
        </Popup>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test("without close button.", () => {
      const component = renderer.create(
        <Popup
          map={map}
          feature={feat}
          renderCloseButton={() => {
            return null;
          }}
        >
          <div id="bar" />
        </Popup>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test("without header.", () => {
      const component = renderer.create(
        <Popup
          map={map}
          feature={feat}
          renderHeader={() => {
            return null;
          }}
        >
          <div id="bar" />
        </Popup>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test("with tabIndex defined.", () => {
      const component = renderer.create(
        <Popup map={map} feature={feat} tabIndex="0">
          <div id="bar" />
        </Popup>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  [
    ["click", {}],
    ["keypress", { which: 13 }],
  ].forEach((evt) => {
    test(`should trigger onCloseClick function on ${evt[0]} event.`, () => {
      const spy = jest.fn(() => {});

      const component = mount(
        <Popup map={map} feature={feat} onCloseClick={spy}>
          <div id="gux" />
        </Popup>,
      );

      component
        .find("div")
        .at(3)
        .simulate(...evt);
      expect(spy).toHaveBeenCalled();
    });

    test(`should trigger default onCloseClick function on ${evt[0]} event without errors.`, () => {
      const component = mount(
        <Popup map={map} feature={feat}>
          <div id="gux" />
        </Popup>,
      );
      // test if no js error triggered by the default value
      try {
        component
          .find("div")
          .at(3)
          .simulate(...evt);
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
      const component = mount(
        <Popup map={map} popupCoordinate={[1001, 1002]}>
          <div id="gux" />
        </Popup>,
      );
      expect(component.state().left).toBe(10010);
      expect(component.state().top).toBe(100200);
      component.setProps({ feature: featLine });
      map.getPixelFromCoordinate = jest.fn(() => {
        return [10011, 100100];
      });
      component.setProps({ popupCoordinate: [1009, 1009] });
      expect(component.state().left).toBe(10011);
      expect(component.state().top).toBe(100100);
    });

    test(`using feature.`, () => {
      map.getPixelFromCoordinate = jest.fn(() => {
        return [10010, 100200];
      });
      const component = mount(
        <Popup map={map} feature={feat}>
          <div id="gux" />
        </Popup>,
      );
      expect(component.state().left).toBe(10010);
      expect(component.state().top).toBe(100200);
      map.getPixelFromCoordinate = jest.fn(() => {
        return [10011, 100100];
      });
      component.setProps({ feature: featLine });
      expect(component.state().left).toBe(10011);
      expect(component.state().top).toBe(100100);
    });
  });

  describe(`updates position`, () => {
    test(`on map postrender event.`, () => {
      map.getPixelFromCoordinate = jest.fn(() => {
        return [10, 200];
      });
      const component = shallow(
        <Popup map={map} feature={feat}>
          <div id="gux" />
        </Popup>,
      );
      const spy = jest.spyOn(component.instance(), "updatePixelPosition");
      map.dispatchEvent({ type: "postrender" });
      expect(spy).toHaveBeenCalledTimes(1);
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
      mount(
        <Popup map={map} feature={feat} panIntoView>
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
      mount(
        <Popup
          map={map}
          feature={feat}
          panIntoView
          panRect={{ top: 0, left: 0, bottom: -10, right: 0 }}
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
      mount(
        <Popup
          map={map}
          feature={feat}
          panIntoView
          panRect={{ top: 0, left: 0, bottom: 0, right: 0 }}
        >
          <div id="gux" />
        </Popup>,
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  test(`deregisters postrender on unmount.`, () => {
    map.getPixelFromCoordinate = jest.fn(() => {
      return [10, 200];
    });
    const component = shallow(
      <Popup map={map} feature={featLine}>
        <div id="gux" />
      </Popup>,
    );
    const spy = jest.spyOn(component.instance(), "updatePixelPosition");
    map.dispatchEvent({ type: "postrender" });
    expect(spy).toHaveBeenCalledTimes(1);
    component.unmount();
    map.dispatchEvent({ type: "postrender" });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
