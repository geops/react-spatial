import React from "react";
import { Layer } from "mobility-toolbox-js/ol";
import { fireEvent, render } from "@testing-library/react";
import BaseLayerSwitcher from "./BaseLayerSwitcher";

describe("BaseLayerSwitcher", () => {
  let layers;
  const layerImages = {
    layerFoo: "foo",
    layerBar: "bar",
    layerFoobar: "foobar",
  };

  beforeEach(() => {
    layers = [
      new Layer({
        name: "bl1",
      }),
      new Layer({
        name: "bl2",
        visible: false,
      }),
      new Layer({
        name: "bl3",
        visible: false,
      }),
    ];
  });

  describe("matches snapshots", () => {
    test("using default properties.", () => {
      const { container } = render(
        <BaseLayerSwitcher layers={layers} layerImages={layerImages} />,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  test("the correct baselayer is visible on mount", () => {
    render(<BaseLayerSwitcher layers={layers} layerImages={layerImages} />);
    expect(layers[0].visible).toBe(true);
  });

  test("removes open class and switches layer on click", async () => {
    const { container } = render(
      <BaseLayerSwitcher layers={layers} layerImages={layerImages} />,
    );
    await fireEvent.click(container.querySelector(".rs-opener"));
    await fireEvent.click(
      container.querySelectorAll(".rs-base-layer-switcher-button")[3],
    );
    expect(layers[2].visible).toBe(true);
    expect(!!container.querySelector(".rs-base-layer-switcher rs-open")).toBe(
      false,
    );
  });

  test("toggles base map instead of opening when only two base layers", async () => {
    const { container } = render(
      <BaseLayerSwitcher layers={layers.slice(0, 2)} />,
    );
    expect(layers[0].visible).toBe(true);
    await fireEvent.click(container.querySelector(".rs-opener"));
    expect(layers[1].visible).toBe(true);
    expect(!!container.querySelector(".rs-base-layer-switcher rs-open")).toBe(
      false,
    );
  });
});
