import { getLayersAsFlatArray, Layer } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import PropTypes from "prop-types";
import React, { Component } from "react";

const propTypes = {
  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * Boolean determining whether children collapse/expand when their parent is toggled
   * @param {...(boolean|function)} expandChildren Boolean or function returning a boolean.
   * @return {boolean} True or false
   */
  expandChildren: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

  /**
   * Determine the className used by the div containing the parent and its children.
   */
  getParentClassName: PropTypes.func,

  /**
   * Determine if the item is hidden in the tree or not.
   *
   * @param {object} item The item to hide or not.
   *
   * @return {bool} true if the item is not displayed in the tree
   */
  isItemHidden: PropTypes.func,

  /**
   * Layers provider.
   */
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),

  /**
   * Padding left to apply on each level.
   */
  padding: PropTypes.number,

  /**
   * Custom function to render custom content after the list of children of an item.
   *
   * @param {object} item The item to render.
   *
   * @return {node} A jsx node.
   */
  renderAfterItem: PropTypes.func,

  /**
   * Custom function to render custom content before the list of children of an item.
   *
   * @param {object} item The item to render.
   *
   * @return {node} A jsx node.
   */
  renderBeforeItem: PropTypes.func,

  /**
   * Custom function to render the checkbox.
   */
  renderCheckbox: PropTypes.func,

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
   * Custom function to render the label.
   *
   * @param {string} item The label to render.
   * @param {LayerTree} comp The LayerTree component.
   *
   * @return {node} A jsx node.
   */
  renderLabel: PropTypes.func,

  /**
   * Translation function.
   * @param {function} Translation function returning the translated string.
   */
  t: PropTypes.func,

  /**
   * Object holding title for the layer tree's buttons.
   */
  titles: PropTypes.shape({
    /**
     * aria-label on checkbox to hide layer.
     */
    layerHide: PropTypes.string,
    /**
     * aria-label on checkbox to show layer.
     */
    layerShow: PropTypes.string,
    /**
     * title on button to show sublayers.
     */
    subLayerHide: PropTypes.string,
    /**
     * title on button to show sublayers.
     */
    subLayerShow: PropTypes.string,
  }),
};

const defaultProps = {
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
  renderLabel: (layer, layerComp) => {
    const { t } = layerComp.props;
    return t(layer.name);
  },
  t: (s) => {
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
 * The LayerTree component renders an interface for toggling
 * [mobility-toolbox-js layers](https://mobility-toolbox-js.geops.io/api/identifiers%20html#ol-layers)
 * and their corresponding child layers.
 */

class LayerTree extends Component {
  constructor(props) {
    super(props);

    const { isItemHidden, layers } = this.props;
    const initialExpandedLayers = layers
      ? this.getExpandedLayers(
          layers.filter((l) => {
            return (
              !isItemHidden(l) &&
              (l.children || [])
                .filter((child) => {
                  return child.visible;
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
      rootLayer: new Layer(),
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

  expandLayer(layer, expLayers = []) {
    const { isItemHidden } = this.props;
    if (layer.visible && !isItemHidden(layer)) {
      const children = layer.children
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
  getExpandedLayers(layers) {
    const { isItemHidden } = this.props;
    const children = layers.flatMap((l) => {
      return l.children.filter((c) => {
        return !isItemHidden(c) && c.get("isAlwaysExpanded");
      });
    });

    if (!children.length) {
      return layers;
    }
    return [...layers, this.getExpandedLayers(children)].flat();
  }

  onInputClick(layer, toggle = false) {
    if (toggle) {
      this.onToggle(layer);
    } else if (layer.setVisible) {
      layer.setVisible(!layer.visible);
    } else {
      // eslint-disable-next-line no-param-reassign
      layer.visible = !layer.visible;
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

  render() {
    const { className } = this.props;
    return <div className={className}>{this.renderTree()}</div>;
  }

  renderArrow(layer) {
    const { isItemHidden } = this.props;
    const { expandedLayers } = this.state;

    if (
      !(layer.children || []).filter((c) => {
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

  renderInput(layer, inputProps) {
    const { isItemHidden, renderCheckbox, titles } = this.props;
    let tabIndex = 0;

    if (
      !(layer.children || []).filter((c) => {
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
        aria-label={layer.visible ? titles.layerHide : titles.layerShow}
        className={`rs-layer-tree-input rs-layer-tree-input-${inputType} rs-${inputType}`}
        onKeyPress={(e) => {
          if (e.which === 13) {
            this.onInputClick(layer);
          }
        }}
        tabIndex={tabIndex}
        title={layer.visible ? titles.layerHide : titles.layerShow}
      >
        <input
          checked={layer.visible}
          onClick={() => {
            return this.onInputClick(layer);
          }}
          readOnly
          tabIndex={-1}
          type={inputType}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
        />
        <span />
      </label>
    );
  }

  // Render a button which expands/collapse the layer if there is children
  renderItem(layer, level) {
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
          ...(layer.children || []).filter((c) => {
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
          className={`rs-layer-tree-item ${layer.visible ? "rs-visible" : ""}`}
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

  renderItemContent(layer, inputProps = {}, toggleProps = {}) {
    return (
      <>
        {this.renderInput(layer, inputProps)}
        {this.renderToggleButton(layer, toggleProps)}
      </>
    );
  }

  // or simulate a click on the input otherwise.
  renderToggleButton(layer, toggleProps) {
    const { isItemHidden, renderLabel, t, titles } = this.props;
    const { expandedLayers } = this.state;

    const onInputClick = () => {
      this.onInputClick(
        layer,
        (layer.children || []).filter((c) => {
          return !isItemHidden(c);
        }).length && !layer.get("isAlwaysExpanded"),
      );
    };
    const title = `${t(layer.name)} ${
      expandedLayers.includes(layer) ? titles.subLayerHide : titles.subLayerShow
    }`;

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
        // eslint-disable-next-line react/jsx-props-no-spreading
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

    if (!rootLayer?.children?.length) {
      return null;
    }

    return (
      <>
        {rootLayer.children
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
    let rootLayer = new Layer();
    if (Array.isArray(layers)) {
      if (layers.length === 1) {
        [rootLayer] = layers;
      }
      rootLayer = new Layer({ children: layers });
    } else {
      rootLayer = layers;
    }

    getLayersAsFlatArray(rootLayer).forEach((layer) => {
      this.olKeys.push(
        layer.on("propertychange", () => {
          const { revision } = this.state;
          this.setState({ revision: revision + 1 });
        }),
      );
    });

    const state = { rootLayer };
    if (
      typeof expandChildren === "function"
        ? expandChildren(layers)
        : expandChildren
    ) {
      state.expandedLayers = rootLayer.children.flatMap((l) => {
        return this.expandLayer(l);
      });
    }

    this.setState(state);
  }
}

LayerTree.propTypes = propTypes;
LayerTree.defaultProps = defaultProps;

export default LayerTree;
