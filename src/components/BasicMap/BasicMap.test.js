import { render } from "@testing-library/react";
import "jest-canvas-mock";
import { Layer } from "mobility-toolbox-js/ol";
import OLLayer from "ol/layer/Vector";
import OLMap from "ol/Map";
import MapEvent from "ol/MapEvent";
import { register } from "ol/proj/proj4";
import OLView from "ol/View";
import proj4 from "proj4";
import React from "react";

import BasicMap from "./BasicMap";

proj4.defs(
  "EPSG:21781",
  "+proj=somerc +lat_0=46.95240555555556 " +
    "+lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel " +
    "+towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs",
);

register(proj4);

const extent = [0, 0, 1000, 1000];
const olLayers = [
  new Layer({
    name: "foo",
    olLayer: new OLLayer({}),
    visible: true,
  }),
];

describe("BasicMap", () => {
  let olMap;
  beforeEach(() => {
    const olView = new OLView();
    olMap = new OLMap({ view: olView });
  });

  test("should be rendered", () => {
    const setTarget = jest.spyOn(olMap, "setTarget");
    render(<BasicMap map={olMap} />);
    expect(setTarget).toHaveBeenCalled();
  });

  test("should be rendered with touchAction to none", () => {
    render(<BasicMap map={olMap} />);
    expect(olMap.getViewport().style.touchAction).toBe("none");
    expect(olMap.getViewport().style.msTouchAction).toBe("none");
    expect(olMap.getViewport().getAttribute("touch-action")).toBe("none");
  });

  test("uses onMapMoved function", () => {
    const spy = jest.fn(() => {});
    const spy2 = jest.fn();
    const evt = new MapEvent("moveend", olMap);

    // Test componentDidMount
    const { rerender } = render(<BasicMap map={olMap} onMapMoved={spy} />);
    olMap.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(evt);

    // Test componentDidUpdate
    rerender(<BasicMap map={olMap} onMapMoved={spy2} />);
    olMap.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(evt);

    // Test componentDidUpdate
    rerender(<BasicMap map={olMap} onMapMoved={null} />);
    olMap.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test("uses onFeaturesClick function", () => {
    const spy = jest.fn();
    const spy2 = jest.fn();
    const evt = new MapEvent("singleclick", olMap);

    // Test componentDidMount
    const { rerender } = render(<BasicMap map={olMap} onFeaturesClick={spy} />);
    olMap.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith([], evt);

    // Test componentDidUpdate
    rerender(<BasicMap map={olMap} onFeaturesClick={spy2} />);
    olMap.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith([], evt);

    // Test componentDidUpdate
    rerender(<BasicMap map={olMap} onFeaturesClick={null} />);
    olMap.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test("uses onFeaturesHover function", () => {
    const spy = jest.fn();
    const spy2 = jest.fn();
    const evt = new MapEvent("pointermove", olMap);

    // Test componentDidMount
    const { rerender } = render(
      <BasicMap map={olMap} onFeaturesHover={spy} />,
      {
        lifecycleExperimental: true,
      },
    );
    olMap.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith([], evt);

    // Test componentDidUpdate
    rerender(<BasicMap map={olMap} onFeaturesHover={spy2} />);
    olMap.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith([], evt);

    // Test componentDidUpdate
    rerender(<BasicMap map={olMap} onFeaturesHover={null} />);
    olMap.dispatchEvent(evt);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test("should be rendered with a default map", () => {
    const { container } = render(<BasicMap />);
    expect(!!container.querySelector(".ol-viewport")).toBe(true);
  });

  test("should be rendered with layers and an extent", () => {
    render(
      <BasicMap
        extent={extent}
        layers={olLayers}
        map={olMap}
        viewOptions={{
          maxZoom: 22,
          minZoom: 16,
          projection: "EPSG:21781",
        }}
      />,
    );
    expect(olMap.getLayers().getLength()).toBe(1);
    expect(olMap.getView().calculateExtent()).toEqual([
      380.70084231351245, 380.70084231351245, 619.2991576864875,
      619.2991576864875,
    ]);
  });

  test("center shoud be set", () => {
    const { rerender } = render(<BasicMap map={olMap} />);
    const setCenter = jest.spyOn(olMap.getView(), "setCenter");
    rerender(<BasicMap center={[0, 0]} map={olMap} />);
    expect(setCenter).toHaveBeenCalled();
  });

  test("zoom shoud be set", () => {
    const { rerender } = render(<BasicMap map={olMap} zoom={5} />);
    expect(olMap.getView().getZoom()).toBe(5);
    rerender(<BasicMap map={olMap} zoom={2} />);
    expect(olMap.getView().getZoom()).toBe(2);
  });

  test("resolution shoud be set", () => {
    const { rerender } = render(<BasicMap map={olMap} resolution={100} />);
    expect(olMap.getView().getResolution()).toBe(100);
    rerender(<BasicMap map={olMap} resolution={5} />);
    expect(olMap.getView().getResolution()).toBe(5);
  });

  test("animation shoud be set", () => {
    const obj = {
      zoom: 4,
    };
    const { rerender } = render(<BasicMap map={olMap} />);
    const spy = jest.spyOn(olMap.getView(), "animate");
    rerender(<BasicMap animationOptions={obj} map={olMap} />);
    expect(spy).toHaveBeenCalledWith(obj);
  });

  test("layers shoud be updated", () => {
    const addLayer = jest.spyOn(olMap, "addLayer");
    const { rerender } = render(<BasicMap map={olMap} />);
    const layer = new Layer({ name: "test", olLayer: new OLLayer() });
    rerender(<BasicMap layers={[layer]} map={olMap} />);
    expect(addLayer).toHaveBeenCalled();
  });

  test("should be fitted if extent is updated", () => {
    const fitExtent = jest.spyOn(OLView.prototype, "fit");
    const { rerender } = render(<BasicMap map={olMap} />);
    rerender(<BasicMap extent={[1, 2, 3, 4]} map={olMap} />);
    expect(fitExtent).toHaveBeenCalled();
  });

  test("should be zoomed if zoom is updated", () => {
    const setZoom = jest.spyOn(OLView.prototype, "setZoom");
    const { rerender } = render(<BasicMap map={olMap} />);
    rerender(<BasicMap map={olMap} zoom={15} />);
    expect(setZoom).toHaveBeenCalledWith(15);
  });

  describe("#setLayers()", () => {
    test("init all layers and terminate al previous layer.", () => {
      const layer0 = new Layer({ key: "test1" });
      const spyInit0 = jest.spyOn(layer0, "attachToMap");
      const spyTerminate0 = jest.spyOn(layer0, "detachFromMap");
      const layer1 = new Layer({ key: "test1" });
      const spyInit1 = jest.spyOn(layer1, "attachToMap");
      const spyTerminate1 = jest.spyOn(layer1, "detachFromMap");
      const layer2 = new Layer({ key: "test2" });
      const spyInit2 = jest.spyOn(layer2, "attachToMap");
      const spyTerminate2 = jest.spyOn(layer2, "detachFromMap");
      const layer3 = new Layer({ key: "test3" });
      const spyInit3 = jest.spyOn(layer3, "attachToMap");
      const spyTerminate3 = jest.spyOn(layer3, "detachFromMap");
      const layer4 = new Layer({ key: "test4" });
      const spyInit4 = jest.spyOn(layer4, "attachToMap");
      const spyTerminate4 = jest.spyOn(layer4, "detachFromMap");
      const startLayers = [layer1, layer3];
      const { rerender } = render(
        <BasicMap layers={startLayers} map={olMap} />,
      );
      expect(spyInit0).toHaveBeenCalledTimes(0);
      expect(spyInit1).toHaveBeenCalledTimes(1);
      expect(spyInit2).toHaveBeenCalledTimes(0);
      expect(spyInit3).toHaveBeenCalledTimes(1);
      expect(spyInit4).toHaveBeenCalledTimes(0);
      expect(spyTerminate0).toHaveBeenCalledTimes(0);
      expect(spyTerminate1).toHaveBeenCalledTimes(1);
      expect(spyTerminate2).toHaveBeenCalledTimes(0);
      expect(spyTerminate3).toHaveBeenCalledTimes(1);
      expect(spyTerminate4).toHaveBeenCalledTimes(0);

      const layers = [layer0, layer2, layer3, layer4];
      rerender(<BasicMap layers={layers} map={olMap} />);
      expect(spyInit0).toHaveBeenCalledTimes(1);
      expect(spyInit1).toHaveBeenCalledTimes(1);
      expect(spyInit2).toHaveBeenCalledTimes(1);
      expect(spyInit3).toHaveBeenCalledTimes(2);
      expect(spyInit4).toHaveBeenCalledTimes(1);
      expect(spyTerminate0).toHaveBeenCalledTimes(1);
      expect(spyTerminate1).toHaveBeenCalledTimes(2);
      expect(spyTerminate2).toHaveBeenCalledTimes(1);
      expect(spyTerminate3).toHaveBeenCalledTimes(3);
      expect(spyTerminate4).toHaveBeenCalledTimes(1);
    });
  });
});
