import "jest-canvas-mock";
import React from "react";
import { Map, View } from "ol";
import { render, act } from "@testing-library/react";
import Tile from "ol/Tile";
import TileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import { createXYZ } from "ol/tilegrid";
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

const getOLTileLayer = (options = {}) => {
  const layer = new TileLayer({
    ...options,
    source: new TileSource({
      projection: "EPSG:3857",
      tileGrid: createXYZ(),
    }),
  });
  layer.getSource().getTile = tileLoadFunction;
  return layer;
};

const getLayer = (copyrights, visible = true) => {
  return getOLTileLayer({
    visible,
    copyrights,
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
      target,
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
    map.setSize([200, 200]);
    layers.forEach((layer) => {
      map.addLayer(layer);
    });
    act(() => {
      map.renderSync();
    });
  });

  afterEach(() => {
    layers.forEach((layer) => {
      map.removeLayer(layer);
    });
    map.setTarget(null);
    map = null;
  });

  test("is empty if no layers are visible", () => {
    const { container } = render(<Copyright map={map} />);
    expect(container.innerHTML).toMatchSnapshot();
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
    layers[0].setVisible(true);
    layers[1].setVisible(true);
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
        map={map}
        format={(copyrights) => {
          return `Number of copyrights: ${copyrights.length}`;
        }}
      />,
    );

    act(() => {
      map.renderSync();
    });

    expect(container.textContent).toBe("Number of copyrights: 1");
  });

  test("set a custom className", () => {
    const { container } = render(<Copyright map={map} className="foo" />);

    act(() => {
      map.renderSync();
    });

    expect(container.querySelectorAll(".foo").length).toBe(1);
  });

  test("set a custom attribute to the root element", () => {
    const { container } = render(
      <Copyright map={map} className="lala" foo="bar" />,
    );

    act(() => {
      map.renderSync();
    });

    expect(container.querySelectorAll("[foo]").length).toBe(1);
  });
});
