import React, { Component } from "react";
import PropTypes from "prop-types";
import { unByKey } from "ol/Observable";
import Layer from "ol/layer/Layer";
import getLayersAsFlatArray from "../../utils/getLayersAsFlatArray";

const propTypes = {
  /**
   * Layers provider.
   */
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),

  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * Padding left to apply on each level.
   */
  padding: PropTypes.number,

  /**
   * Determine if the item is hidden in the tree or not.
   *
   * @param {object} item The item to hide or not.
   *
   * @return {bool} true if the item is not displayed in the tree
   */
  isItemHidden: PropTypes.func,

  /**
   * Determine the className used by the div containing the parent and its children.
   */
  getParentClassName: PropTypes.func,

  /**
   * Custom function to render an item in the tree.
   *
   * @param {object} item The item to render.
   *
   * @return {node} A jsx node.
   */
  renderItem: PropTypes.func,

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
  renderItemContent: PropTypes.func,

  /**
   * Custom function to render custom content before the list of children of an item.
   *
   * @param {object} item The item to render.
   *
   * @return {node} A jsx node.
   */
  renderBeforeItem: PropTypes.func,

  /**
   * Custom function to render custom content after the list of children of an item.
   *
   * @param {object} item The item to render.
   *
   * @return {node} A jsx node.
   */
  renderAfterItem: PropTypes.func,

  /**
   * Custom function to render the label.
   *
   * @param {string} item The label to render.
   * @param {LayerTree} comp The LayerTree component.
   *
   * @return {node} A jsx node.
   */
  renderLabel: PropTypes.func,

  /**
   * Custom function to render the checkbox.
   */
  renderCheckbox: PropTypes.func,

  /**
   * Object holding title for the layer tree's buttons.
   */
  titles: PropTypes.shape({
    /**
     * aria-label on checkbox to show layer.
     */
    layerShow: PropTypes.string,
    /**
     * aria-label on checkbox to hide layer.
     */
    layerHide: PropTypes.string,
    /**
     * title on button to show sublayers.
     */
    subLayerShow: PropTypes.string,
    /**
     * title on button to show sublayers.
     */
    subLayerHide: PropTypes.string,
  }),

  /**
   * Boolean determining whether children collapse/expand when their parent is toggled
   * @param {...(boolean|function)} expandChildren Boolean or function returning a boolean.
   * @return {boolean} True or false
   */
  expandChildren: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

  /**
   * Translation function.
   * @param {function} Translation function returning the translated string.
   */
  t: PropTypes.func,
};

const defaultProps = {
  layers: [],
  className: "rs-layer-tree",
  padding: 30,
  isItemHidden: () => {
    return false;
  },
  getParentClassName: () => {
    return undefined;
  },
  renderItem: null,
  renderItemContent: null,
  renderBeforeItem: null,
  renderAfterItem: null,
  renderCheckbox: null,
  renderLabel: (layer, layerComp) => {
    const { t } = layerComp.props;
    return t(layer.name);
  },
  titles: {
    layerShow: "Show layer",
    layerHide: "Hide layer",
    subLayerShow: "Show sublayer",
    subLayerHide: "Hide sublayer",
  },
  t: (s) => {
    return s;
  },
  expandChildren: false,
};

/**
 * The LayerTree component renders an interface for toggling
 * [mobility-toolbox-js layers](https://mobility-toolbox-js.geops.io/api/identifiers%20html#ol-layers)
 * and their corresponding child layers.
 */

class LayerTree extends Component {
  static getChildren = (layer) =>
    layer?.children ||
    layer?.get("children") ||
    // ol.layer.group
    layer?.getLayers?.().getArray() ||
    [];

  static getVisible = (layer) =>
    layer.getVisible ? layer.getVisible() : layer.visible;

  static setVisible = (layer, visible) => {
    if (layer.setVisible) {
      layer.setVisible(visible);
      return;
    }
    // eslint-disable-next-line no-param-reassign
    layer.visible = visible;
  };

  static listenGroups = (layers) => {
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

  constructor(props) {
    super(props);

    const { layers, isItemHidden } = this.props;
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
      rootLayer: new Layer({}),
      expandedLayers: initialExpandedLayers,
      revision: 0,
    };
    // this.updateLayers = this.updateLayers.bind(this);
    this.olKeys = [];
  }

  componentDidMount() {
    this.updateLayers();
  }

  componentDidUpdate(prevProps) {
    const { layers } = this.props;

    if (layers !== prevProps.layers) {
      this.updateLayers();
    }
  }

  componentWillUnmount() {
    unByKey(this.olKeys);
    this.olKeys = [];
  }

  onInputClick(layer, toggle = false) {
    if (toggle) {
      this.onToggle(layer);
    } else {
      LayerTree.setVisible(layer, !LayerTree.getVisible(layer));
    }
  }

  onToggle(layer) {
    const { expandedLayers } = this.state;
    const pos = expandedLayers.indexOf(layer);
    if (pos > -1) {
      expandedLayers.splice(pos, 1);
    } else {
      expandedLayers.push(...this.getExpandedLayers([layer]));
    }
    this.setState({ expandedLayers });
  }

  /**
   * Get the always expanded ancestors (isAlwaysExpanded=true) of the given layers
   * together with the (given) initially expanded layers
   *
   * @param  {Layer} layers Initially expanded layers
   * @return {Array.<Layer>} Initially expanded layers and all its always expanded ancestors
   */
  getExpandedLayers(layers) {
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

  updateLayers() {
    const { layers, expandChildren } = this.props;

    // Update the root layer
    let rootLayer = new Layer({});
    if (Array.isArray(layers)) {
      if (layers.length === 1) {
        [rootLayer] = layers;
      }
      rootLayer = new Layer({ children: layers });
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
            if (children && !children.some((child) => child.getVisible())) {
              children.forEach((child) => {
                child.setVisible(true);
              });
            }
          } else {
            // We hide all the children
            children.forEach((child) => {
              child.setVisible(false);
            });

            // If the parent has no more visible child we also hide it.
            if (
              parent?.getVisible() &&
              !parent?.get("children").find((child) => child.getVisible())
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
      state.expandedLayers = children.flatMap((l) => {
        return this.expandLayer(l);
      });
    }

    this.setState(state);
  }

  expandLayer(layer, expLayers = []) {
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

  renderInput(layer, inputProps) {
    const { titles, isItemHidden, renderCheckbox } = this.props;
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
      // eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/no-noninteractive-element-interactions
      <label
        className={`rs-layer-tree-input rs-layer-tree-input-${inputType} rs-${inputType}`}
        tabIndex={tabIndex}
        title={
          LayerTree.getVisible(layer) ? titles.layerHide : titles.layerShow
        }
        onKeyPress={(e) => {
          if (e.which === 13) {
            this.onInputClick(layer);
          }
        }}
      >
        <input
          type={inputType}
          tabIndex={-1}
          checked={LayerTree.getVisible(layer)}
          readOnly
          onClick={() => {
            return this.onInputClick(layer);
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
        />
        <span />
      </label>
    );
  }

  renderArrow(layer) {
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

  // Render a button which expands/collapse the layer if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(layer, toggleProps) {
    const { t, titles, isItemHidden, renderLabel } = this.props;
    const { expandedLayers } = this.state;

    const onInputClick = () => {
      this.onInputClick(
        layer,
        LayerTree.getChildren(layer).filter((c) => {
          return !isItemHidden(c);
        }).length && !layer.get("isAlwaysExpanded"),
      );
    };
    const title = `${t(layer.name)} ${
      expandedLayers.includes(layer) ? titles.subLayerHide : titles.subLayerShow
    }`;

    return (
      <div
        role="button"
        tabIndex={0}
        className="rs-layer-tree-toggle"
        title={title}
        aria-expanded={expandedLayers.includes(layer)}
        aria-label={title}
        onClick={onInputClick}
        onKeyPress={onInputClick}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...toggleProps}
      >
        <div>{renderLabel(layer, this)}</div>
        {this.renderArrow(layer)}
      </div>
    );
  }

  renderItemContent(layer, inputProps = {}, toggleProps = {}) {
    return (
      <>
        {this.renderInput(layer, inputProps)}
        {this.renderToggleButton(layer, toggleProps)}
      </>
    );
  }

  renderItem(layer, level) {
    const { isItemHidden } = this.props;
    const { expandedLayers } = this.state;
    const {
      renderItem,
      renderItemContent,
      renderBeforeItem,
      renderAfterItem,
      padding,
      getParentClassName,
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
      <div className={getParentClassName()} key={layer.key}>
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
        {renderBeforeItem && renderBeforeItem(layer, level, this)}
        {[...children].reverse().map((child) => {
          return this.renderItem(child, level + 1);
        })}
        {renderAfterItem && renderAfterItem(layer, level, this)}
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

  render() {
    const { className } = this.props;
    return <div className={className}>{this.renderTree()}</div>;
  }
}

LayerTree.propTypes = propTypes;
LayerTree.defaultProps = defaultProps;

export default LayerTree;
