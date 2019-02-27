import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import Observable from 'ol/Observable';
import Button from '../button/Button';

const propTypes = {
  /**
   * Layers provider.
   */
  service: PropTypes.object,

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
  service: undefined,
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
  static hasChildren(item) {
    return !!((item.getChildren && item.getChildren()) || []).length;
  }

  static onToggle(item) {
    item.setProperties({
      isExpanded: !item.getProperties().isExpanded,
    });
  }

  static onInputClick(item) {
    item.setVisible(!item.getVisible());
    if (item.getRadioGroup() === 'root') {
      LayerTree.onToggle(item);
    }
  }

  // This function is only used to display an outline on focus around all the item of the first level.
  static renderBarrierFreeDiv(item, level) {
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
        onKeyPress={e => e.which === 13 && LayerTree.onInputClick(item)}
      />
    );
  }

  constructor(props) {
    super(props);
    // Prefix used for the name of inputs. This allows multiple LayerTree on the same page.
    this.prefixInput = shortid.generate();
    this.state = {
      layers: null,
    };
    this.olKeys = [];
  }

  componentDidMount() {
    this.updateState();
  }

  componentDidUpdate() {
    this.updateState();
  }

  updateState() {
    const { service } = this.props;
    const { layers } = this.state;

    if (service && (!layers || layers.length !== service.getLayers().length)) {
      this.setState({
        layers: service.getLayers(),
      });
      this.listenChangeEvts();
    }
  }

  listenChangeEvts() {
    const { service } = this.props;
    // Remove listeners
    this.olKeys.forEach(key => {
      Observable.unByKey(key);
    });
    service.on('change:visible', () => {
      this.setState({
        layers: service.getLayers(),
      });
    });
  }

  renderInput(item, level) {
    const { classNameInput } = this.props;
    let tabIndex = 0;

    if (!LayerTree.hasChildren(item) || !level) {
      // We forbid focus on keypress event for first level items and items without children.
      tabIndex = -1;
    }
    const inputType = item.getRadioGroup() ? 'radio' : 'checkbox';
    return (
      <label // eslint-disable-line
        className={`${classNameInput} ${classNameInput}-${inputType}`}
        tabIndex={tabIndex}
        onKeyPress={e => e.which === 13 && LayerTree.onInputClick(item)}
      >
        <input
          type={inputType}
          name={item.getRadioGroup()}
          tabIndex={-1}
          checked={item.getVisible()}
          onChange={() => {}}
          onClick={() => {
            LayerTree.onInputClick(item);
          }}
        />
        <span />
      </label>
    );
  }

  renderArrow(item) {
    const { classNameArrow } = this.props;
    if (!LayerTree.hasChildren(item)) {
      return null;
    }
    return (
      <div
        className={`${classNameArrow} ${classNameArrow}${
          item.getProperties().isExpanded ? '-expanded' : '-collapsed'
        }`}
      />
    );
  }

  // Render a button which expands/collapse the item if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(item, level) {
    const { classNameToggle } = this.props;
    let tabIndex = 0;

    if (!level) {
      // We forbid focus on the first level items using keypress.
      tabIndex = -1;
    }

    return (
      <Button
        tabIndex={tabIndex}
        className={classNameToggle}
        onClick={() => {
          if (!level || !LayerTree.hasChildren(item)) {
            LayerTree.onInputClick(item);
          } else {
            LayerTree.onToggle(item);
          }
        }}
      >
        <div>{item.getName()}</div>
        {this.renderArrow(item)}
      </Button>
    );
  }

  renderItem(item, level) {
    const { renderItem, classNameItem, padding } = this.props;
    let children = (item.getChildren && item.getChildren()) || [];

    if (children.length && !item.getProperties().isExpanded) {
      children = [];
    }

    if (renderItem) {
      return renderItem(item);
    }

    return (
      <div key={item.getId()}>
        <div
          className={classNameItem}
          style={{
            paddingLeft: `${padding * level}px`,
          }}
        >
          {LayerTree.renderBarrierFreeDiv(item, level)}
          {this.renderInput(item, level)}
          {this.renderToggleButton(item, level)}
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
        {[...layers]
          .reverse()
          .map(item => (isItemHidden(item) ? null : this.renderItem(item, 0)))}
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
