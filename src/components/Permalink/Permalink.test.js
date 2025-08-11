import "jest-canvas-mock";
import { act, render } from "@testing-library/react";
import Layer from "ol/layer/Layer";
import OLMap from "ol/Map";
import MapEvent from "ol/MapEvent";
import View from "ol/View";
import React from "react";

import Permalink from "./Permalink";

const defaultIsLayerHidden = (l) => {
  let isParentHidden = false;
  let { parent } = l;
  while (!isParentHidden && parent) {
    isParentHidden = parent.get("hideInLegend");
    parent = parent.parent;
  }

  return l.get("hideInLegend") || isParentHidden;
};

describe("Permalink", () => {
  let layers;
  beforeEach(() => {
    // Ensure default empty url.
    window.history.pushState({}, undefined, "/");
    layers = [
      new Layer({
        hideInLegend: true,
        key: "ultimate.layer",
        name: "Ultimate layer",
        visible: true,
      }),
      new Layer({
        hideInLegend: true,
        key: "swiss.boundaries",
        name: "Swiss boundaries",
        visible: false,
      }),
      new Layer({
        group: "baseLayer",
        isBaseLayer: true,
        key: "basebright.baselayer",
        name: "Base - Bright",
      }),
      new Layer({
        group: "baseLayer",
        isBaseLayer: true,
        key: "basedark.baselayer",
        name: "Base - Dark",
        visible: false,
      }),
      new Layer({
        children: [
          new Layer({
            hideInLegend: true,
            key: "child.hidden.1",
            name: "Child 1 hidden",
            visible: true,
          }),
          new Layer({
            hideInLegend: true,
            key: "child.hidden.2",
            name: "Childr 2 hidden",
            visible: false,
          }),
        ],
        key: "children.hidden.layer",
        name: "Layer with children that are hidden",
        visible: true,
      }),
    ];
  });

  test("should initialize x, y & z with history.", () => {
    const history = {
      replace: jest.fn((v) => {
        return v;
      }),
    };

    const params = {
      x: 1000,
      y: 1000,
      z: 7,
    };

    const { rerender } = render(
      <Permalink history={history} params={params} />,
    );

    act(() => {
      rerender(
        <Permalink
          history={history}
          params={{
            x: 1001,
            y: 1002,
            z: 7,
          }}
        />,
      );
    });
    const search = "?x=1001&y=1002&z=7";

    expect(history.replace.mock.results[1].value.search).toEqual(search);
  });

  test("should initialize x, y & z Permalink without history.", () => {
    const params = {
      x: 1000,
      y: 1000,
      z: 7,
    };

    const { rerender } = render(<Permalink params={params} />);
    act(() => {
      rerender(
        <Permalink
          params={{
            x: 1001,
            y: 1002,
            z: 7,
          }}
        />,
      );
    });
    const search = "?x=1001&y=1002&z=7";

    expect(window.location.search).toEqual(search);
  });

  test("should initialize Permalink with layers.", () => {
    expect(window.location.search).toEqual("");
    render(<Permalink layers={layers} />);
    const search =
      "?baselayers=basebright.baselayer,basedark.baselayer&layers=ultimate.layer,child.hidden.1";
    expect(window.location.search).toEqual(search);
  });

  test("should initialize Permalink with isLayerHidden.", () => {
    expect(window.location.search).toEqual("");
    render(<Permalink isLayerHidden={defaultIsLayerHidden} layers={layers} />);
    const search =
      "?baselayers=basebright.baselayer,basedark.baselayer&layers=children.hidden.layer";
    expect(window.location.search).toEqual(search);
  });

  test("should initialize Permalink with map.", () => {
    expect(window.location.search).toEqual("");
    const olMap = new OLMap({
      controls: [],
      view: new View({
        center: [1001, 1002],
        zoom: 5,
      }),
    });
    render(<Permalink map={olMap} />);
    act(() => {
      olMap.dispatchEvent(new MapEvent("moveend", olMap));
    });
    const search = "?x=1001&y=1002&z=5";

    expect(window.location.search).toEqual(search);
  });

  test("should limit 2 decimals by default for x, y.", () => {
    expect(window.location.search).toEqual("");
    const olMap = new OLMap({
      controls: [],
      view: new View({
        center: [10010.555555, 10010.5555555],
        zoom: 5,
      }),
    });
    render(<Permalink map={olMap} />);

    act(() => {
      olMap.dispatchEvent(new MapEvent("moveend", olMap));
    });

    const search = "?x=10010.56&y=10010.56&z=5";

    expect(window.location.search).toEqual(search);
  });

  test('should round values x & y ".00" for readability.', () => {
    expect(window.location.search).toEqual("");
    const olMap = new OLMap({
      controls: [],
      view: new View({
        center: [10010.99999, 1001.000001],
        zoom: 5,
      }),
    });
    render(<Permalink map={olMap} />);
    act(() => {
      olMap.dispatchEvent(new MapEvent("moveend", olMap));
    });
    expect(window.location.search).toEqual("?x=10011&y=1001&z=5");
  });

  test('should limit 4 decimals with props "coordinateDecimals".', () => {
    expect(window.location.search).toEqual("");
    const olMap = new OLMap({
      controls: [],
      view: new View({
        center: [10010.555555, 10010.5555555],
        zoom: 5,
      }),
    });
    render(<Permalink coordinateDecimals={4} map={olMap} />);
    act(() => {
      olMap.dispatchEvent(new MapEvent("moveend", olMap));
    });

    expect(window.location.search).toEqual("?x=10010.5556&y=10010.5556&z=5");
  });

  test("should react on layers change.", () => {
    expect(window.location.search).toEqual("");
    const { rerender } = render(<Permalink layers={layers} />);
    let layersParam = new URLSearchParams(window.location.search).get("layers");
    expect(layersParam).toBe("ultimate.layer,child.hidden.1");
    rerender(
      <Permalink
        layers={[
          new Layer({
            key: "foo.layer",
            name: "foo",
          }),
        ]}
      />,
    );

    layersParam = new URLSearchParams(window.location.search).get("layers");
    expect(layersParam).toBe("foo.layer");
  });

  test("should react on layer visiblity change.", () => {
    expect(window.location.search).toEqual("");
    render(<Permalink layers={layers} />);
    let layersParam = new URLSearchParams(window.location.search).get("layers");
    expect(layersParam).toBe("ultimate.layer,child.hidden.1");

    act(() => {
      layers
        .find((l) => {
          return l.get("name") === "Swiss boundaries";
        })
        .setVisible(true);
    });

    layersParam = new URLSearchParams(window.location.search).get("layers");
    expect(layersParam).toBe("ultimate.layer,swiss.boundaries,child.hidden.1");
  });

  test("should react on base layer visiblity change.", () => {
    expect(window.location.search).toEqual("");
    render(<Permalink layers={layers} />);

    let baseLayers = new URLSearchParams(window.location.search).get(
      "baselayers",
    );
    expect(baseLayers).toBe("basebright.baselayer,basedark.baselayer");

    act(() => {
      layers
        .find((l) => {
          return l.get("name") === "Base - Dark";
        })
        .setVisible(true);
    });

    baseLayers = new URLSearchParams(window.location.search).get("baselayers");
    expect(baseLayers).toBe("basedark.baselayer,basebright.baselayer");
  });
});
