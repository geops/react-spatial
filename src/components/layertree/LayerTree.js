import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import Observable from 'ol/Observable';
import Button from '../button/Button';

const propTypes = {
  /**
   * Layers provider.
   */
  service: PropTypes.object.isRequired,

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
   * @param {object} provided The option provided by @atlaskit/tree.
   *
   * @return {node} A jsx node.
   */
  renderItem: PropTypes.func,
};

const defaultProps = {
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
    const { service } = this.props;
    const { layers } = this.state;
    if (service && layers && layers.length !== service.getLayers().length) {
      this.setState({
        layers: service.getLayers(),
      });
      this.listenChangeEvts();
    }
  }

  componentDidUpdate() {
    const { service } = this.props;
    const { layers } = this.state;
    if (service && (!layers || layers.length !== service.getLayers().length)) {
      this.setState({
        layers: service.getLayers(),
      });
      this.listenChangeEvts();
    }
  }

  onToggle(item) {
    const { service } = this.props;
    item.setProperties({
      expanded: !item.getProperties().expanded,
    });
    this.setState({
      layers: service.getLayers(),
    });
  }

  onInputClick(item) {
    const { service } = this.props;
    item.setVisible(!item.getVisible());
    if (item.getRadioGroup() === 'root') {
      /* item.setProperties({
        expanded: !item.getProperties().expanded,
      }); */
    }
    this.setState({
      layers: service.getLayers(),
    });
  }

  listenChangeEvts() {
    const { service } = this.props;
    // Remove listeners
    this.olKeys.forEach(key => {
      Observable.unByKey(key);
    });
    service.on('change:visible', () => {
      console.log('changevisible');
      this.setState({
        layers: service.getLayers(),
      });
    });
  }

  // This function is only used to display an outline on focus around all the item of the first level.
  renderBarrierFreeDiv(item, level) {
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
        onKeyPress={e => e.which === 13 && this.onInputClick(item)}
      />
    );
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
        onKeyPress={e => e.which === 13 && this.onInputClick(item)}
      >
        <input
          type="checkbox"
          name={item.getRadioGroup()}
          tabIndex={-1}
          checked={item.getVisible()}
          onChange={() => {}}
          onClick={() => {
            this.onInputClick(item);
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
          item.getProperties().expanded ? '-expanded' : '-collapsed'
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
        role="button"
        style={{ display: 'flex' }}
        tabIndex={tabIndex}
        className={classNameToggle}
        onClick={() => {
          if (!LayerTree.hasChildren(item)) {
            this.onInputClick(item);
          } else {
            this.onToggle(item);
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

    if (children.length && !item.getProperties().expanded) {
      children = [];
    }

    if (renderItem) {
      return renderItem(item);
    }

    return (
      <div key={`${item.getName()}-${item.getRevision()}`}>
        <div
          className={classNameItem}
          style={{
            paddingLeft: `${padding * level}px`,
          }}
        >
          {this.renderBarrierFreeDiv(item, level)}
          {this.renderInput(item, level)}
          {this.renderToggleButton(item, level)}
        </div>
        {[...children]
          .reverse()
          .map(child => this.renderItem(child, level + 1))}
      </div>
    );
  }

  render() {
    const { className, isItemHidden } = this.props;
    const { layers } = this.state;

    return (
      <div className={className}>
        {(layers || [])
          .reverse()
          .map(item => (isItemHidden(item) ? null : this.renderItem(item, 0)))}
      </div>
    );
  }
}

LayerTree.propTypes = propTypes;
LayerTree.defaultProps = defaultProps;

export default LayerTree;
