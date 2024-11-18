import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure, mount } from "enzyme";
import Layer from "ol/layer/Layer";
import "jest-canvas-mock";
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import renderer from "react-test-renderer";

import LayerTree from "./LayerTree";

configure({ adapter: new Adapter() });

const mountLayerTree = (layers) => {
  return mount(<LayerTree layers={layers} />);
};

const renderLayerTree = (layers, props) => {
  const component = renderer.create(
    <LayerTree layers={layers} {...(props || {})} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
};

const classItem = ".rs-layer-tree-item";
const toggleItem = ".rs-layer-tree-toggle";

describe("LayerTree", () => {
  let layers;

  beforeEach(() => {
    layers = [
      new Layer({
        name: "root",
      }),
      new Layer({
        children: [
          new Layer({
            group: "radio",
            name: "1-1",
            radioGroup: "radio",
          }),
          new Layer({
            children: [
              new Layer({
                name: "1-2-1",
                visible: false,
              }),
              new Layer({
                name: "1-2-2",
                visible: false,
              }),
              new Layer({
                name: "2",
                visible: false,
              }),
            ],
            group: "radio",
            name: "1-2",
            properties: {
              radioGroup: "radio",
            },
            radioGroup: "radio",
            visible: false,
          }),
        ],
        name: "1",
      }),
    ];
  });
  describe("matches snapshots", () => {
    test("using default properties.", () => {
      renderLayerTree(layers);
    });

    test("when no layers.", () => {
      const component = renderer.create(<LayerTree layers={[]} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test("when renderItem is used.", () => {
      renderLayerTree(layers, {
        renderItem: (item) => {
          const { name } = item;
          return <div key={name}>{name}</div>;
        },
      });
    });

    test("when renderCheckbox is used.", () => {
      renderLayerTree(layers, {
        renderCheckbox: (l) => {
          return <div>{l.visible ? "✓" : "✗"}</div>;
        },
      });
    });

    test("when classNames are used.", () => {
      renderLayerTree(layers, { className: "foo" });
    });

    test("when an item is hidden.", () => {
      renderLayerTree(layers, {
        isItemHidden: (item) => {
          return !!item.get("children")?.length;
        },
      });
    });

    test("when an item is hidden (different layer tree levels)", () => {
      renderLayerTree(layers, {
        isItemHidden: (item) => {
          return item.isBaseLayer || item.get("hideInLegend");
        },
      });
    });

    test("when an item use renderBeforeItem.", () => {
      renderLayerTree(layers, {
        renderBeforeItem: (layer, level) => {
          const { name } = layer;
          return (
            <div>
              Render name before item: {name}, level: {level}
            </div>
          );
        },
      });
    });

    test("when an item use renderAfterItem.", () => {
      renderLayerTree(layers, {
        renderAfterItem: (layer, level) => {
          const { name } = layer;
          return (
            <div>
              Render name after item: {name}, level: {level}
            </div>
          );
        },
      });
    });

    test("when expandChildren is true.", () => {
      renderLayerTree(layers, {
        expandChildren: true,
      });
    });

    test("when expandChildren is a function.", () => {
      renderLayerTree(layers, {
        expandChildren: (lyrs) => {
          return lyrs.length === 3;
        },
      });
    });

    test("when items are always expanded", () => {
      const newLayers = [
        new Layer({
          children: [
            new Layer({
              children: [
                new Layer({
                  children: [
                    new Layer({
                      name: "Visible layer 1.1.1.1 (as parent is expanded)",
                      visible: true,
                    }),
                  ],
                  isAlwaysExpanded: true,
                  name: "Expanded layer 1.1.1 (because of isAlwaysExpanded=true)",
                  properties: {
                    isAlwaysExpanded: true,
                  },
                  visible: true,
                }),
                new Layer({
                  children: [
                    new Layer({
                      name: "Invisible layer 1.1.1.1 (as parent is hidden)",
                      visible: true,
                    }),
                  ],
                  hideInLegend: true,
                  name: "Hidden layer 1.1.1 (because of hidden=true)",
                  properties: {
                    hideInLegend: true,
                  },
                  visible: true,
                }),
              ],
              isAlwaysExpanded: true,
              name: "Expanded layer 1.1 (because of isAlwaysExpanded=true)",
              visible: true,
            }),
            new Layer({
              children: [
                new Layer({
                  children: [
                    new Layer({
                      name: "Invisible layer 1.2.1.1 (as parent isAlwaysExpanded=false)",
                      visible: true,
                    }),
                  ],
                  name: "Visible layer 1.2.1 (as parent is expanded)",
                  visible: true,
                }),
              ],
              isAlwaysExpanded: true,
              name: "Expanded layer 1.2 (because of isAlwaysExpanded=true)",
              properties: {
                isAlwaysExpanded: true,
              },
              visible: true,
            }),
          ],
          name: "Expanded layer 1 (because of level 1)",
          visible: true,
        }),
        new Layer({
          children: [
            new Layer({
              children: [
                new Layer({
                  children: [
                    new Layer({
                      name: "Invisible layer 2.1.1.1 (as parent is not visible)",
                      visible: true,
                    }),
                  ],
                  isAlwaysExpanded: true,
                  name: "Invisible layer 2.1.1 (as parent isAlwaysExpanded=false)",
                  properties: {
                    isAlwaysExpanded: true,
                  },
                  visible: true,
                }),
              ],
              name: "Visible layer 2.1 (as parent is expanded)",
              visible: true,
            }),
            new Layer({
              children: [
                new Layer({
                  children: [
                    new Layer({
                      name: "Invisible layer 2.2.1.1 (as parent is not visible)",
                      visible: true,
                    }),
                  ],
                  name: "Invisible layer 2.2.1 (as parent isAlwaysExpanded=false)",
                  visible: true,
                }),
              ],
              name: "Visible layer 2.2 (as parent is expanded)",
              visible: true,
            }),
          ],
          name: "Expanded layer 2 (because of level 1)",
          visible: true,
        }),
      ];

      renderLayerTree(newLayers, {
        isItemHidden: (item) => {
          return item.get("hideInLegend");
        },
      });
    });
  });

  describe("triggers onInputClick", () => {
    let wrapper;
    let spy;
    let spy2;
    const newLayers = [
      new Layer({
        name: "foo",
      }),
    ];
    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
      expect(spy.mock.calls[0][0].get("name")).toBe("foo");
    };

    beforeEach(() => {
      spy = jest.spyOn(LayerTree.prototype, "onInputClick");
      spy2 = jest.spyOn(LayerTree.prototype, "onToggle");
      wrapper = mountLayerTree(newLayers);
    });

    afterEach(() => {
      spy.mockRestore();
      spy2.mockRestore();
    });

    test("when we press enter with keyboard on the label element.", () => {
      wrapper.find("label").at(0).simulate("keypress", { which: 13 });
      expectCalled();
    });

    test("when we click on input.", () => {
      wrapper.find("input").at(0).simulate("click");
      expectCalled();
    });

    test("when we click on toggle button (label+arrow) of an item without children.", () => {
      wrapper.find(classItem).first().childAt(1).simulate("click");
      expectCalled();
    });
  });

  describe("triggers onToggle", () => {
    let wrapper;
    let spy;
    const newLayers = [
      new Layer({
        children: [
          new Layer({
            name: "1-1",
          }),
          new Layer({
            name: "1-1-1",
          }),
        ],
        name: "1",
      }),
    ];

    const expectCalled = () => {
      expect(spy).toHaveBeenCalledTimes(1);
    };

    beforeEach(() => {
      spy = jest.spyOn(LayerTree.prototype, "onToggle");
      wrapper = mountLayerTree(newLayers);
    });

    test("when we click on toggle button (label+arrow) of an item with children", () => {
      wrapper.find(toggleItem).first().simulate("click");
      expectCalled();
    });
  });
});
