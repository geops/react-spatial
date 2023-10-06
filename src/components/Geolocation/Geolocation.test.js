import React from "react";
import renderer from "react-test-renderer";
import { configure, mount, shallow } from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";

import "jest-canvas-mock";
import Map from "ol/Map";
import View from "ol/View";
import MapEvent from "ol/MapEvent";
import Geolocation from "./Geolocation";

configure({ adapter: new Adapter() });

const geolocationBackup = global.navigator.geolocation;

const mockGeolocation = () => {
  const mock = {
    clearWatch: jest.fn(),
    getCurrentPosition: jest.fn(),
    watchPosition: (onSuccess) => {
      onSuccess({
        coords: {
          latitude: 47.9913611,
          longitude: 7.84868,
          accuracy: 55,
        },
        timestamp: 1552660077044,
      });
    },
  };

  global.navigator.geolocation = mock;
};

const mockMissingGeolocation = () => {
  delete global.navigator.geolocation;
};

const restoreGeolocation = () => {
  global.navigator.geolocation = geolocationBackup;
};

class CallbackHandler {
  static onError() {}

  static onSuccess() {}

  static onActivate() {}

  static onDeactivate() {}
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
      const component = renderer.create(<Geolocation map={map} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test("with title", () => {
      const component = renderer.create(
        <Geolocation map={map} title="Lokalisieren" />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test("with class name", () => {
      const component = renderer.create(
        <Geolocation map={map} className="my-class-name" />,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  test("should use children", () => {
    mockGeolocation();

    const wrapper = mount(<Geolocation map={map}>test</Geolocation>);

    const text = wrapper.find(".rs-geolocation").first().text();

    expect(text).toBe("test");

    restoreGeolocation();
  });

  describe("button classes", () => {
    test("class should be active", () => {
      mockGeolocation();

      const wrapper = mount(<Geolocation map={map} />);
      const basic = wrapper.getDOMNode();

      wrapper.find(".rs-geolocation").first().simulate("click");

      expect(basic.className).toBe("rs-geolocation rs-active");

      restoreGeolocation();
    });

    test("class should not be active", () => {
      mockGeolocation();

      const wrapper = mount(<Geolocation map={map} />);
      const basic = wrapper.getDOMNode();

      wrapper
        .find(".rs-geolocation")
        .first()
        .simulate("click")
        .simulate("click");

      expect(basic.className).toBe("rs-geolocation ");

      restoreGeolocation();
    });
  });

  test(`highlight on first toggle`, () => {
    mockGeolocation();

    const component = shallow(<Geolocation map={map} />);
    const instance = component.instance();
    const spy = jest.spyOn(instance, "highlight");
    instance.toggle();
    expect(spy).toHaveBeenCalled();

    restoreGeolocation();
  });

  test(`success/activate/deactivate callback functions should be called`, () => {
    mockGeolocation();
    const spyOnSuccess = jest.spyOn(CallbackHandler, "onSuccess");
    const spyOnActivate = jest.spyOn(CallbackHandler, "onActivate");
    const spyOnDeactivate = jest.spyOn(CallbackHandler, "onDeactivate");

    const wrapper = mount(
      <Geolocation
        map={map}
        onSuccess={() => {
          return CallbackHandler.onSuccess();
        }}
        onActivate={() => {
          return CallbackHandler.onActivate();
        }}
        onDeactivate={() => {
          return CallbackHandler.onDeactivate();
        }}
      />,
    );

    wrapper.find(".rs-geolocation").first().simulate("click");

    expect(spyOnActivate).toHaveBeenCalled();
    expect(spyOnSuccess).toHaveBeenCalled();

    wrapper.find(".rs-geolocation").first().simulate("click");

    expect(spyOnDeactivate).toHaveBeenCalled();

    restoreGeolocation();
  });

  test(`error function should be called`, () => {
    mockMissingGeolocation();

    const spy = jest.spyOn(CallbackHandler, "onError");

    const wrapper = mount(
      <Geolocation
        map={map}
        onError={() => {
          return CallbackHandler.onError();
        }}
      />,
    );

    wrapper.find(".rs-geolocation").first().simulate("click");

    expect(spy).toHaveBeenCalled();

    restoreGeolocation();
  });

  describe("map centering", () => {
    test("centers map", () => {
      mockGeolocation();

      const center1 = [742952.8821531708, 6330118.608483334];
      map.getView().setCenter(center1);

      const component = shallow(<Geolocation map={map} />);
      component.instance().toggle();

      const center2 = map.getView().getCenter();
      expect(center1).not.toEqual(center2);

      restoreGeolocation();
    });

    test("sets isRecenteringToPosition=false after pointerdrag event with the noCenterAfterDrag prop", () => {
      mockGeolocation();

      const component = shallow(<Geolocation map={map} noCenterAfterDrag />);
      component.instance().toggle();

      expect(component.instance().isRecenteringToPosition).toEqual(true);

      map.dispatchEvent(new MapEvent("pointerdrag", map));
      expect(component.instance().isRecenteringToPosition).toEqual(false);

      restoreGeolocation();
    });
  });

  test("custom style function", () => {
    mockGeolocation();

    const styleFunc = jest.fn();

    const component = shallow(
      <Geolocation map={map} colorOrStyleFunc={styleFunc} />,
    );
    const instance = component.instance();
    instance.toggle();
    const style = instance.layer.getSource().getFeatures()[0].getStyle();

    expect(style).toBe(styleFunc);

    restoreGeolocation();
  });
});
