import Layer from "ol/layer/Layer";
import { unByKey } from "ol/Observable";
import { getUid } from "ol/util";
import { Component } from "react";

import getLayersAsFlatArray from "../../utils/getLayersAsFlatArray";

import type React from "react";

export interface LayerTreeTitles {
  /**
   * aria-label on checkbox to hide layer.
   */
  layerHide?: string;
  /**
   * aria-label on checkbox to show layer.
   */
  layerShow?: string;
  /**
   * title on button to show sublayers.
   */
  subLayerHide?: string;
  /**
   * title on button to show sublayers.
   */
  subLayerShow?: string;
}

export interface LayerTreeProps {
  /**
   * CSS class to apply on the container.
   */
  className?: string;
  /**
   * Boolean determining whether children collapse/expand when their parent is toggled
   * @param {...(boolean|function)} expandChildren Boolean or function returning a boolean.
   * @return {boolean} True or false
   */
  expandChildren?: ((layers: Layer[]) => boolean) | boolean;
  /**
   * Determine the className used by the div containing the parent and its children.
   */
  getParentClassName?: () => string | undefined;
  /**
   * Determine if the item is hidden in the tree or not.
   *
   * @param {object} item The item to hide or not.
   *
   * @return {bool} true if the item is not displayed in the tree
   */
  isItemHidden?: (item: any) => boolean;
  /**
   * Layers provider.
   */
  layers?: Layer[];
  /**
   * Padding left to apply on each level.
   */
  padding?: number;
  /**
   * Custom function to render custom content after the list of children of an item.
   *
   * @param {object} item The item to render.
   *
   * @return {node} A jsx node.
   */
  renderAfterItem?: (
    layer: any,
    level: number,
    comp: LayerTree,
  ) => React.ReactNode;
  /**
   * Custom function to render custom content before the list of children of an item.
   *
   * @param {object} item The item to render.
   *
   * @return {node} A jsx node.
   */
  renderBeforeItem?: (
    layer: any,
    level: number,
    comp: LayerTree,
  ) => React.ReactNode;
  /**
   * Custom function to render the checkbox.
   */
  renderCheckbox?: (
    layer: any,
    comp: LayerTree,
    inputProps?: any,
  ) => React.ReactNode;
  /**
   * Custom function to render an item in the tree.
   *
   * @param {object} item The item to render.
   *
   * @return {node} A jsx node.
   */
  renderItem?: (
    layer: any,
    onInputClick: any,
    onToggle: any,
  ) => React.ReactNode;
  /**
   * Custom function to render only the content of an item in the tree.
   * inputProps und toggleProps can be used when calling the default renderItemContent function
   * (comp.renderItemContent(layer, inputProps, toggleProps)) to overwrite the default input and label props
   *
   * @param {Layer} layer The layer the item content is created for
   * @param {LayerTree} comp The LayerTree component.
   *
   * @return {node} A jsx node.
   */
  renderItemContent?: (layer: any, comp: LayerTree) => React.ReactNode;
  /**
   * Custom function to render the label.
   *
   * @param {string} item The label to render.
   * @param {LayerTree} comp The LayerTree component.
   *
   * @return {node} A jsx node.
   */
  renderLabel?: (layer: any, comp?: LayerTree) => React.ReactNode;
  /**
   * Translation function.
   * @param {function} Translation function returning the translated string.
   */
  t?: (s: string) => string;
  /**
   * Object holding title for the layer tree's buttons.
   */
  titles?: LayerTreeTitles;
}

interface LayerTreeState {
  expandedLayers: Layer[];
  revision: number;
  rootLayer: any;
}

const defaultProps: Partial<LayerTreeProps> = {
  className: "rs-layer-tree",
  expandChildren: false,
  getParentClassName: () => {
    return undefined;
  },
  isItemHidden: () => {
    return false;
  },
  layers: [],
  padding: 30,
  renderAfterItem: null,
  renderBeforeItem: null,
  renderCheckbox: null,
  renderItem: null,
  renderItemContent: null,
  renderLabel: (layer: any) => {
    return layer?.get("name") || "";
  },
  t: (s: string) => {
    return s;
  },
  titles: {
    layerHide: "Hide layer",
    layerShow: "Show layer",
    subLayerHide: "Hide sublayer",
    subLayerShow: "Show sublayer",
  },
};

/**
 * The LayerTree component renders an interface for toggling layers visibility.
 * and their corresponding child layers.
 */

class LayerTree extends Component<LayerTreeProps, LayerTreeState> {
  olKeys: any[];

  constructor(props: LayerTreeProps) {
    super(props);

    const { isItemHidden, layers } = this.props;
    const initialExpandedLayers = layers
      ? this.getExpandedLayers(
          layers.filter((l) => {
            return (
              !isItemHidden(l) &&
              LayerTree.getChildren(l)
                .filter((child) => {
                  return LayerTree.getVisible(child);
                })
                .filter((c) => {
                  return !isItemHidden(c);
                }).length
            );
          }),
        )
      : [];

    this.state = {
      expandedLayers: initialExpandedLayers,
      revision: 0,
      rootLayer: new Layer({}),
    };
    // this.updateLayers = this.updateLayers.bind(this);
    this.olKeys = [];
  }

  static getChildren = (layer: any) => {
    return (
      layer?.get("children") ||
      layer?.children ||
      // ol.layer.group
      layer?.getLayers?.().getArray() ||
      []
    );
  };

  static getVisible = (layer: any) => {
    return layer.getVisible ? layer.getVisible() : layer.visible;
  };

  static listenGroups = (layers: any[]) => {
    const flat = getLayersAsFlatArray(layers);
    const keys = flat.map((layer) => {
      return layer.on("change:visible", (e) => {
        const { target } = e;
        if (target.getVisible() && target.get("group")) {
          flat.forEach((l) => {
            if (l.get("group") === target.get("group") && l !== target) {
              l.setVisible(false);
            }
          });
        }
      });
    });
    return keys;
  };

  static setVisible = (layer: any, visible: boolean) => {
    if (layer.setVisible) {
      layer.setVisible(visible);
      return;
    }

    layer.visible = visible;
  };

  componentDidMount() {
    this.updateLayers();
  }

  componentDidUpdate(prevProps: LayerTreeProps) {
    const { layers } = this.props;

    if (layers !== prevProps.layers) {
      this.updateLayers();
    }
  }

  componentWillUnmount() {
    unByKey(this.olKeys);
    this.olKeys = [];
  }

  expandLayer(layer: any, expLayers: any[] = []) {
    const { isItemHidden } = this.props;
    if (LayerTree.getVisible(layer) && !isItemHidden(layer)) {
      const children = LayerTree.getChildren(layer)
        .filter((c) => {
          return !isItemHidden(c) && !c.get("isAlwaysExpanded");
        })
        .flatMap((c) => {
          return this.expandLayer(c, expLayers);
        });
      return [...expLayers, ...children, layer];
    }
    return expLayers;
  }

  /**
   * Get the always expanded ancestors (isAlwaysExpanded=true) of the given layers
   * together with the (given) initially expanded layers
   *
   * @param  {Layer} layers Initially expanded layers
   * @return {Array.<Layer>} Initially expanded layers and all its always expanded ancestors
   */
  getExpandedLayers(layers: any[]) {
    const { isItemHidden } = this.props;
    const children = layers.flatMap((l) => {
      return LayerTree.getChildren(l).filter((c) => {
        return !isItemHidden(c) && c.get("isAlwaysExpanded");
      });
    });

    if (!children.length) {
      return layers;
    }
    return [...layers, this.getExpandedLayers(children)].flat();
  }

  onInputClick(layer: any, toggle = false) {
    if (toggle) {
      this.onToggle(layer);
    } else {
      LayerTree.setVisible(layer, !LayerTree.getVisible(layer));
    }
  }

  onToggle(layer: any) {
    const { expandedLayers } = this.state;
    const pos = expandedLayers.indexOf(layer);
    if (pos > -1) {
      expandedLayers.splice(pos, 1);
    } else {
      expandedLayers.push(...this.getExpandedLayers([layer]));
    }
    this.setState({ expandedLayers });
  }

  render() {
    const { className } = this.props;
    return <div className={className}>{this.renderTree()}</div>;
  }

  renderArrow(layer: any) {
    const { isItemHidden } = this.props;
    const { expandedLayers } = this.state;

    if (
      !LayerTree.getChildren(layer).filter((c) => {
        return !isItemHidden(c);
      }).length ||
      layer.get("isAlwaysExpanded")
    ) {
      return null;
    }

    return (
      <div
        className={`rs-layer-tree-arrow rs-layer-tree-arrow-${
          !expandedLayers.includes(layer) ? "collapsed" : "expanded"
        }`}
      />
    );
  }

  renderInput(layer: any, inputProps?: any) {
    const { isItemHidden, renderCheckbox, titles } = this.props;
    let tabIndex = 0;

    if (
      !LayerTree.getChildren(layer).filter((c) => {
        return !isItemHidden(c);
      }).length
    ) {
      // We forbid focus on keypress event for first level layers and layers without children.
      tabIndex = -1;
    }

    const inputType = layer.get("group") ? "radio" : "checkbox";
    return renderCheckbox ? (
      renderCheckbox(layer, this, inputProps)
    ) : (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <label
        className={`rs-layer-tree-input rs-layer-tree-input-${inputType} rs-${inputType}`}
        onKeyPress={(e) => {
          if (e.which === 13) {
            this.onInputClick(layer);
          }
        }}
        tabIndex={tabIndex}
        title={
          LayerTree.getVisible(layer) ? titles.layerHide : titles.layerShow
        }
      >
        <input
          checked={LayerTree.getVisible(layer)}
          onClick={() => {
            return this.onInputClick(layer);
          }}
          readOnly
          tabIndex={-1}
          type={inputType}
          {...inputProps}
        />
        <span />
      </label>
    );
  }

  renderItem(layer: any, level: number) {
    const { isItemHidden } = this.props;
    const { expandedLayers } = this.state;
    const {
      getParentClassName,
      padding,
      renderAfterItem,
      renderBeforeItem,
      renderItem,
      renderItemContent,
    } = this.props;

    const children = expandedLayers.includes(layer)
      ? [
          ...LayerTree.getChildren(layer).filter((c) => {
            return !isItemHidden(c);
          }),
        ]
      : [];

    if (renderItem) {
      return renderItem(layer, this.onInputClick, this.onToggle);
    }

    return (
      <div
        className={getParentClassName()}
        key={
          layer.key || layer.get("key") || layer.get("name") || getUid(layer)
        }
      >
        <div
          className={`rs-layer-tree-item ${LayerTree.getVisible(layer) ? "rs-visible" : ""}`}
          style={{
            paddingLeft: `${padding * level}px`,
          }}
        >
          {renderItemContent
            ? renderItemContent(layer, this)
            : this.renderItemContent(layer)}
        </div>
        {renderBeforeItem?.(layer, level, this)}
        {[...children].reverse().map((child) => {
          return this.renderItem(child, level + 1);
        })}
        {renderAfterItem?.(layer, level, this)}
      </div>
    );
  }

  renderItemContent(layer: any, inputProps: any = {}, toggleProps: any = {}) {
    return (
      <>
        {this.renderInput(layer, inputProps)}
        {this.renderToggleButton(layer, toggleProps)}
      </>
    );
  }

  // Render a button which expands/collapse the layer if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(layer: any, toggleProps?: any) {
    const { isItemHidden, renderLabel, titles } = this.props;
    const { expandedLayers } = this.state;

    const onInputClick = () => {
      this.onInputClick(
        layer,
        LayerTree.getChildren(layer).filter((c) => {
          return !isItemHidden(c);
        }).length && !layer.get("isAlwaysExpanded"),
      );
    };
    let title = `${renderLabel(layer, this)} ${
      expandedLayers.includes(layer) ? titles.subLayerHide : titles.subLayerShow
    }`;

    if (typeof title !== "string") {
      title = undefined;
    }

    return (
      <div
        aria-expanded={expandedLayers.includes(layer)}
        aria-label={title}
        className="rs-layer-tree-toggle"
        onClick={onInputClick}
        onKeyPress={onInputClick}
        role="button"
        tabIndex={0}
        title={title}
        {...toggleProps}
      >
        <div>{renderLabel(layer, this)}</div>
        {this.renderArrow(layer)}
      </div>
    );
  }

  renderTree() {
    const { isItemHidden } = this.props;
    const { rootLayer } = this.state;

    if (!LayerTree.getChildren(rootLayer).length) {
      return null;
    }

    return (
      <>
        {LayerTree.getChildren(rootLayer)
          .filter((l) => {
            return !isItemHidden(l);
          })
          .reverse()
          .map((l) => {
            return this.renderItem(l, 0);
          })}
      </>
    );
  }

  updateLayers() {
    const { expandChildren, layers } = this.props;

    // Update the root layer
    let rootLayer = new Layer({});
    if (Array.isArray(layers)) {
      if (layers.length === 1) {
        [rootLayer] = layers;
      }
      rootLayer = new Layer({ children: layers } as any);
    } else {
      rootLayer = layers;
    }

    const flat = getLayersAsFlatArray(rootLayer);
    flat.forEach((layer) => {
      this.olKeys.push(
        layer.on("propertychange", () => {
          const { revision } = this.state;
          this.setState({ revision: revision + 1 });
        }),

        // Manage group visibility
        layer.on("change:visible", (evt) => {
          const { target } = evt;
          if (target.getVisible() && target.get("group")) {
            flat.forEach((l) => {
              if (l.get("group") === target.get("group") && l !== target) {
                l.setVisible(false);
              }
            });
          }
        }),

        // Manage parent/children visibility
        layer.on("change:visible", (evt) => {
          const { target } = evt;
          const parent = target.get("parent");
          const children = LayerTree.getChildren(target);

          if (target.getVisible()) {
            // We make the parent visible
            if (parent) {
              parent.setVisible(true);
            }

            // If children doesn't contain any visible layers, we display all children.
            if (
              children &&
              !children.some((child) => {
                return child.getVisible();
              })
            ) {
              children.forEach((child) => {
                child.setVisible(true);
              });
            }

            // We make the maplibre layer visible
            if (target.maplibreLayer?.getVisible() === false) {
              target.get("maplibreLayer").setVisible(true);
            }
          } else {
            // We hide all the children
            children.forEach((child) => {
              child.setVisible(false);
            });

            // If the parent has no more visible child we also hide it.
            if (
              parent?.getVisible() &&
              !parent?.get("children").find((child) => {
                return child.getVisible();
              })
            ) {
              parent.setVisible(false);
            }
          }
        }),
      );
    });

    // Set parent property.
    flat.forEach((layer) => {
      const children = LayerTree.getChildren(layer);
      children.forEach((child) => {
        child.set("parent", layer);
      });
    });

    const state = { rootLayer };
    if (
      typeof expandChildren === "function"
        ? expandChildren(layers)
        : expandChildren
    ) {
      const children = LayerTree.getChildren(rootLayer);
      (state as any).expandedLayers = children.flatMap((l) => {
        return this.expandLayer(l);
      });
    }

    this.setState(state);
  }
}

(LayerTree as any).defaultProps = defaultProps;

export default LayerTree;
