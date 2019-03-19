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
   * Custom function to render an item in the tree.
   *
   * @param {object} item The item to render.
   *
   * @return {node} A jsx node.
   */
  renderItem: PropTypes.func,
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
  renderItem: null,
};

class LayerTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: props.layerService ? props.layerService.getLayers() : [],
      expandedLayerNames: [],
    };

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

  onInputClick(layer, toggle = false) {
    if (toggle) {
      this.onToggle(layer);
    } else {
      layer.setVisible(!layer.getVisible());
    }
  }

  onToggle(layer) {
    const { expandedLayerNames } = this.state;
    const pos = expandedLayerNames.indexOf(layer.getName());
    if (pos > -1) {
      expandedLayerNames.splice(pos, 1);
    } else {
      expandedLayerNames.push(layer.getName());
    }

    this.setState({ expandedLayerNames });
  }

  updateLayerService() {
    const { layerService } = this.props;
    if (layerService) {
      this.updateLayers(layerService);
      layerService.on('change:visible', () => this.updateLayers(layerService));
    }
  }

  updateLayers(layerService) {
    this.setState({
      layers: layerService.getLayers(),
    });
  }

  renderInput(layer) {
    const { classNameInput } = this.props;
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
          expandedLayerNames.includes(layer.getName())
            ? '-collapsed'
            : '-expanded'
        }`}
      />
    );
  }

  // Render a button which expands/collapse the layer if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(layer) {
    const { classNameToggle } = this.props;
    const tabIndex = 0;

    return (
      <Button
        tabIndex={tabIndex}
        className={classNameToggle}
        onClick={() => {
          this.onInputClick(layer, layer.getChildren().length);
        }}
      >
        <div>{layer.getName()}</div>
        {this.renderArrow(layer)}
      </Button>
    );
  }

  renderItem(layer, level) {
    const { renderItem, classNameItem, padding } = this.props;
    const { expandedLayerNames } = this.state;

    const children = expandedLayerNames.includes(layer.getName())
      ? []
      : [...layer.getChildren()];

    if (renderItem) {
      return renderItem(layer, this.onInputClick, this.onToggle);
    }

    return (
      <div key={layer.getName()}>
        <div
          className={classNameItem}
          style={{
            paddingLeft: `${padding * level}px`,
          }}
        >
          {this.renderInput(layer)}
          {this.renderToggleButton(layer)}
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
