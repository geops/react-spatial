import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import Button from '../button/Button';

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
  static renderBarrierFreeDiv(layer, level) {
    if (level) {
      return null;
    }
    return (
      <div
        style={{
          position: 'absolute',
          margin: 'auto',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        role="button"
        tabIndex={0}
        onKeyPress={e => {
          if (e.which === 13) {
            layer.setVisible(!layer.getVisible());
          }
        }}
      />
    );
  }

  constructor(props) {
    super(props);
    // Prefix used for the name of inputs. This allows multiple LayerTree on the same page.
    this.prefixInput = shortid.generate();
    this.state = {
      layers: props.layerService ? props.layerService.getLayers() : [],
      expandedLayerNames: [],
    };
    this.olKeys = [];
  }

  componentDidUpdate(prevProps) {
    const { layerService } = this.props;

    if (layerService !== prevProps.layerService) {
      this.updateLayers(layerService);
      layerService.on('change:visible', () => this.updateLayers(layerService));
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

  updateLayers(layerService) {
    this.setState({
      layers: layerService.getLayers(),
    });
  }

  renderInput(layer, level) {
    const { classNameInput } = this.props;
    let tabIndex = 0;

    if (!layer.getChildren().length === 0 || !level) {
      // We forbid focus on keypress event for first level layers and layers without children.
      tabIndex = -1;
    }

    const inputType = layer.getRadioGroup() ? 'radio' : 'checkbox';
    return (
      <label // eslint-disable-line
        className={`${classNameInput} ${classNameInput}-${inputType}`}
        tabIndex={tabIndex}
        onKeyPress={e => {
          if (e.which === 13) {
            layer.setVisible(!layer.getVisible());
          }
        }}
      >
        <input
          type={inputType}
          name={layer.getRadioGroup()}
          tabIndex={-1}
          checked={layer.getVisible()}
          onChange={() => {}}
          onClick={() => {
            layer.setVisible(!layer.getVisible());
          }}
        />
        <span />
      </label>
    );
  }

  renderArrow(layer) {
    const { classNameArrow } = this.props;
    const { expandedLayerNames } = this.state;

    if (layer.getChildren().length === 0) {
      return null;
    }

    return (
      <div
        className={`${classNameArrow} ${classNameArrow}${
          expandedLayerNames.indexOf(layer.getName()) > -1
            ? '-expanded'
            : '-collapsed'
        }`}
      />
    );
  }

  // Render a button which expands/collapse the layer if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(layer, level) {
    const { classNameToggle } = this.props;
    let tabIndex = 0;

    if (!level) {
      // We forbid focus on the first level layers using keypress.
      tabIndex = -1;
    }

    return (
      <Button
        tabIndex={tabIndex}
        className={classNameToggle}
        onClick={() => {
          if (layer.getChildren().length === 0) {
            layer.setVisible(!layer.getVisible());
          } else {
            this.onToggle(layer);
          }
        }}
      >
        <div>{layer.getName()}</div>
        {this.renderArrow(layer)}
      </Button>
    );
  }

  renderItem(layer, level) {
    const { renderItem, classNameItem, padding } = this.props;
    const children = [...layer.getChildren()];

    if (renderItem) {
      return renderItem(layer);
    }

    return (
      <div key={layer.getName()}>
        <div
          className={classNameItem}
          style={{
            paddingLeft: `${padding * level}px`,
          }}
        >
          {LayerTree.renderBarrierFreeDiv(layer, level)}
          {this.renderInput(layer, level)}
          {this.renderToggleButton(layer, level)}
        </div>
        {[...children]
          .reverse()
          .map(child => this.renderItem(child, level + 1))}
      </div>
    );
  }

  renderTree() {
    const { isItemHidden } = this.props;
    let { layers } = this.state;

    if (!layers) {
      return null;
    }

    layers = layers.filter(l => !isItemHidden(l));

    return <>{layers.reverse().map(l => this.renderItem(l, 0))}</>;
  }

  render() {
    const { className } = this.props;
    return <div className={className}>{this.renderTree()}</div>;
  }
}

LayerTree.propTypes = propTypes;
LayerTree.defaultProps = defaultProps;

export default LayerTree;
