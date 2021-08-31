import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Layers provider.
   */
  layerService: PropTypes.object,

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
   *
   * @param {object} item The item to render.
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
   * Translation function.
   * @param {function} Translation function returning the translated string.
   */
  t: PropTypes.func,
};

const defaultProps = {
  layerService: undefined,
  className: 'rs-layer-tree',
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
  titles: {
    layerShow: 'Show layer',
    layerHide: 'Hide layer',
    subLayerShow: 'Show sublayer',
    subLayerHide: 'Hide sublayer',
  },
  t: (s) => {
    return s;
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
    const { layerService, isItemHidden } = this.props;
    const initialExpandedLayerNames =
      layerService && layerService.getLayers()
        ? this.getExpandedLayers(
            layerService.getLayers().filter((l) => {
              return (
                !isItemHidden(l) &&
                l.getVisibleChildren().filter((c) => {
                  return !isItemHidden(c);
                }).length
              );
            }),
          )
        : [];

    this.state = {
      layers: layerService ? layerService.getLayers() : [],
      expandedLayerNames: initialExpandedLayerNames,
    };
    this.updateLayers = this.updateLayers.bind(this);
    this.olKeys = [];
  }

  componentDidMount() {
    this.updateLayerService();
  }

  componentDidUpdate(prevProps) {
    const { layerService } = this.props;

    if (layerService !== prevProps.layerService) {
      this.updateLayerService();
    }
  }

  componentWillUnmount() {
    const { layerService } = this.props;
    layerService.un('change:visible', this.updateLayers);
  }

  onInputClick(layer, toggle = false) {
    if (toggle) {
      this.onToggle(layer);
    } else {
      layer.setVisible(!layer.visible);
    }
  }

  onToggle(layer) {
    const { expandedLayerNames } = this.state;
    const pos = expandedLayerNames.indexOf(layer);
    if (pos > -1) {
      expandedLayerNames.splice(pos, 1);
    } else {
      expandedLayerNames.push(...this.getExpandedLayers([layer]));
    }

    this.setState({ expandedLayerNames });
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
        return !isItemHidden(c) && c.get('isAlwaysExpanded');
      });
    });

    if (!children.length) {
      return layers;
    }
    return [...layers, this.getExpandedLayers(children)].flat();
  }

  updateLayerService() {
    const { layerService } = this.props;
    if (layerService) {
      layerService.un('change:visible', this.updateLayers);
      this.updateLayers();
      layerService.on('change:visible', this.updateLayers);
    }
  }

  updateLayers() {
    const { layerService } = this.props;
    this.setState({
      layers: layerService.getLayers(),
    });
  }

  renderInput(layer) {
    const { titles, isItemHidden } = this.props;
    let tabIndex = 0;

    if (
      !layer.children.filter((c) => {
        return !isItemHidden(c);
      }).length
    ) {
      // We forbid focus on keypress event for first level layers and layers without children.
      tabIndex = -1;
    }

    const inputType = layer.get('radioGroup') ? 'radio' : 'checkbox';
    return (
      // eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/no-noninteractive-element-interactions
      <label
        className={`rs-layer-tree-input rs-layer-tree-input-${inputType} rs-${inputType}`}
        tabIndex={tabIndex}
        title={layer.visible ? titles.layerHide : titles.layerShow}
        aria-label={layer.visible ? titles.layerHide : titles.layerShow}
        onKeyPress={(e) => {
          if (e.which === 13) {
            this.onInputClick(layer);
          }
        }}
      >
        <input
          type={inputType}
          tabIndex={-1}
          checked={layer.visible}
          readOnly
          onClick={() => {
            return this.onInputClick(layer);
          }}
        />
        <span />
      </label>
    );
  }

  renderArrow(layer) {
    const { isItemHidden } = this.props;
    const { expandedLayerNames } = this.state;

    if (
      !layer.children.filter((c) => {
        return !isItemHidden(c);
      }).length ||
      layer.get('isAlwaysExpanded')
    ) {
      return null;
    }

    return (
      <div
        className={`rs-layer-tree-arrow rs-layer-tree-arrow-${
          !expandedLayerNames.includes(layer) ? 'collapsed' : 'expanded'
        }`}
      />
    );
  }

  // Render a button which expands/collapse the layer if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(layer) {
    const { t, titles, isItemHidden } = this.props;
    const { expandedLayerNames } = this.state;
    const onInputClick = () => {
      this.onInputClick(
        layer,
        layer.children.filter((c) => {
          return !isItemHidden(c);
        }).length && !layer.get('isAlwaysExpanded'),
      );
    };
    const title = `${t(layer.name)} ${
      !expandedLayerNames.includes(layer)
        ? titles.subLayerShow
        : titles.subLayerHide
    }`;
    return (
      <div
        role="button"
        tabIndex={0}
        className="rs-layer-tree-toggle"
        title={title}
        aria-expanded={expandedLayerNames.includes(layer)}
        aria-label={title}
        onClick={onInputClick}
        onKeyPress={onInputClick}
      >
        <div>{t(layer.name)}</div>
        {this.renderArrow(layer)}
      </div>
    );
  }

  renderItemContent(layer) {
    return (
      <>
        {this.renderInput(layer)}
        {this.renderToggleButton(layer)}
      </>
    );
  }

  renderItem(layer, level) {
    const { isItemHidden } = this.props;
    const {
      renderItem,
      renderItemContent,
      renderBeforeItem,
      renderAfterItem,
      padding,
      getParentClassName,
    } = this.props;
    const { expandedLayerNames } = this.state;

    const children = expandedLayerNames.includes(layer)
      ? [
          ...layer.children.filter((c) => {
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
          className={`rs-layer-tree-item ${layer.visible ? 'rs-visible' : ''}`}
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
    const { layers } = this.state;

    if (!layers) {
      return null;
    }

    return (
      <>
        {layers
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
