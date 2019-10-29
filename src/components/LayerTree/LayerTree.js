import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox';
import Button from '../Button';

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
   * CSS class to apply on each item.
   */
  classNameItem: PropTypes.string,

  /**
   * CSS class to apply to the label element which contains the input.
   * Unused if you use `renderItem` property.
   */
  classNameInput: PropTypes.string,

  /**
   * CSS class to apply to the toggle button which contains the title and the arrow.
   * Unused if you use `renderItem` property.
   */
  classNameToggle: PropTypes.string,

  /**
   * CSS class to apply to the arrow.
   * Unused if you use `renderItem` property.
   */
  classNameArrow: PropTypes.string,

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
   * Object holding title for the layer tree's buttons.
   */
  buttonTitles: PropTypes.shape({
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
  className: 'tm-layer-tree',
  classNameItem: 'tm-layer-tree-item',
  classNameInput: 'tm-layer-tree-input',
  classNameToggle: 'tm-layer-tree-toggle',
  classNameArrow: 'tm-layer-tree-arrow',
  padding: 30,
  isItemHidden: () => false,
  getParentClassName: () => undefined,
  renderItem: null,
  renderItemContent: null,
  buttonTitles: {
    layerShow: null,
    layerHide: null,
    subLayerShow: null,
    subLayerHide: null,
  },
  t: s => s,
};

class LayerTree extends Component {
  constructor(props) {
    super(props);
    const { layerService, isItemHidden } = this.props;
    const initialExpandedLayerNames =
      layerService && layerService.getLayers()
        ? layerService
            .getLayers()
            .filter(l => !isItemHidden(l) && l.getVisibleChildren().length)
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
      layer.setVisible(!layer.getVisible());
    }
  }

  onToggle(layer) {
    const { expandedLayerNames } = this.state;
    const pos = expandedLayerNames.indexOf(layer);
    if (pos > -1) {
      expandedLayerNames.splice(pos, 1);
    } else {
      expandedLayerNames.push(layer);
    }

    this.setState({ expandedLayerNames });
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
    const { classNameInput, buttonTitles } = this.props;
    let tabIndex = 0;

    if (!layer.getChildren().length) {
      // We forbid focus on keypress event for first level layers and layers without children.
      tabIndex = -1;
    }

    const inputType = layer.getRadioGroup() ? 'radio' : 'checkbox';
    return (
      <Checkbox
        tabIndex={tabIndex}
        inputType={inputType}
        checked={layer.getVisible()}
        ariaLabel={
          layer.getVisible() ? buttonTitles.layerHide : buttonTitles.layerShow
        }
        className={`${classNameInput} ${classNameInput}-${inputType}`}
        onClick={() => this.onInputClick(layer)}
      />
    );
  }

  renderArrow(layer) {
    const { classNameArrow } = this.props;
    const { expandedLayerNames } = this.state;

    if (!layer.getChildren().length) {
      return null;
    }

    return (
      <div
        className={`${classNameArrow} ${classNameArrow}${
          !expandedLayerNames.includes(layer) ? '-collapsed' : '-expanded'
        }`}
      />
    );
  }

  // Render a button which expands/collapse the layer if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(layer) {
    const { t, classNameToggle, buttonTitles } = this.props;
    const { expandedLayerNames } = this.state;
    const tabIndex = 0;

    return (
      <Button
        tabIndex={tabIndex}
        title={`${layer.getName()} ${
          !expandedLayerNames.includes(layer)
            ? buttonTitles.subLayerShow
            : buttonTitles.subLayerHide
        }`}
        className={classNameToggle}
        onClick={() => {
          this.onInputClick(layer, layer.getChildren().length);
        }}
      >
        <div>{t(layer.getName())}</div>
        {this.renderArrow(layer)}
      </Button>
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
    const {
      renderItem,
      renderItemContent,
      classNameItem,
      padding,
      getParentClassName,
    } = this.props;
    const { expandedLayerNames } = this.state;

    const children = expandedLayerNames.includes(layer)
      ? [...layer.getChildren()]
      : [];

    if (renderItem) {
      return renderItem(layer, this.onInputClick, this.onToggle);
    }

    return (
      <div className={getParentClassName()} key={layer.getKey()}>
        <div
          className={`${classNameItem} ${
            layer.getVisible() ? 'tm-visible' : ''
          }`}
          style={{
            paddingLeft: `${padding * level}px`,
          }}
        >
          {renderItemContent
            ? renderItemContent(layer, this)
            : this.renderItemContent(layer)}
        </div>
        {[...children]
          .reverse()
          .map(child => this.renderItem(child, level + 1))}
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
          .filter(l => !isItemHidden(l))
          .reverse()
          .map(l => this.renderItem(l, 0))}
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
