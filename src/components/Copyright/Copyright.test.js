import { act, render } from "@testing-library/react";
import "jest-canvas-mock";
import { Layer } from "mobility-toolbox-js/ol";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import Tile from "ol/Tile";
import { createXYZ } from "ol/tilegrid";
import React from "react";

import Copyright from "./Copyright";

const image = new Image();
image.width = 256;
image.height = 256;

const tileLoadFunction = () => {
  const tile = new Tile([0, 0, -1], 2 /* LOADED */);
  tile.getImage = () => {
    return image;
  };
  return tile;
};

const getOLTileLayer = () => {
  const layer = new TileLayer({
    source: new TileSource({
      projection: "EPSG:3857",
      tileGrid: createXYZ(),
    }),
  });
  layer.getSource().getTile = tileLoadFunction;
  return layer;
};

const getLayer = (copyrights, visible = true) => {
  return new Layer({
    copyrights,
    olLayer: getOLTileLayer(),
    visible,
  });
};

let layers;
let map;

describe("Copyright", () => {
  beforeEach(() => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    layers = [getLayer("bar"), getLayer("foo", false)];
    map = new Map({
      controls: [],
      layers: layers.map((layer) => {
        return layer.olLayer;
      }),
      target,
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
    map.setSize([200, 200]);
    layers.forEach((layer) => {
      layer.attachToMap(map);
    });
    act(() => {
      map.renderSync();
    });
  });

  afterEach(() => {
    layers.forEach((layer) => {
      layer.detachFromMap(map);
    });
    map.setTarget(null);
    map = null;
  });

  test("is empty if no layers are visible", () => {
    const { container } = render(<Copyright map={map} />);
    expect(container.innerHTML).toBe("");
  });

  test("displays one copyright", () => {
    const { container } = render(<Copyright map={map} />);
    act(() => {
      map.renderSync();
    });
    expect(container.textContent).toBe("bar");
  });

  test("displays 2 copyrights", () => {
    const { container } = render(<Copyright map={map} />);
    layers[0].visible = true;
    layers[1].visible = true;
    act(() => {
      map.renderSync();
    });
    act(() => {
      map.renderSync();
    });

    expect(container.textContent).toBe("bar | foo");
  });

  test("displays a copyright using a custom format", () => {
    const { container } = render(
      <Copyright
        format={(copyrights) => {
          return `Number of copyrights: ${copyrights.length}`;
        }}
        map={map}
      />,
    );

    act(() => {
      map.renderSync();
    });

    expect(container.textContent).toBe("Number of copyrights: 1");
  });

  test("set a custom className", () => {
    const { container } = render(<Copyright className="foo" map={map} />);

    act(() => {
      map.renderSync();
    });

    expect(container.querySelectorAll(".foo").length).toBe(1);
  });

  test("set a custom attribute to the root element", () => {
    const { container } = render(
      <Copyright className="lala" foo="bar" map={map} />,
    );

    act(() => {
      map.renderSync();
    });

    expect(container.querySelectorAll("[foo]").length).toBe(1);
  });
});
