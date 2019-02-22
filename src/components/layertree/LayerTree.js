import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tree from '@atlaskit/tree';
import shortid from 'shortid';
import Button from '../button/Button';

const propTypes = {
  /**
   * The object representing a hierachical object to display as a tree.
   * This property is only used at initialisation time. Use onItemChange if
   * you want to keep track of the tree status.
   */
  tree: PropTypes.shape({
    rootId: PropTypes.string.isRequired,
    items: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        parentId: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.string).isRequired,
        hasChildren: PropTypes.bool.isRequired,
        hasParent: PropTypes.bool.isRequired,
        isChecked: PropTypes.bool.isRequired,
        isExpanded: PropTypes.bool.isRequired,
        isChildrenLoading: PropTypes.bool.isRequired,
        type: PropTypes.string.isRequired,
        data: PropTypes.shape({
          title: PropTypes.string.isRequired,
        }).isRequired,
        defaults: PropTypes.shape({
          isChecked: PropTypes.bool,
          isExpanded: PropTypes.bool,
        }),
      }),
    ).isRequired,
  }),

  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * CSS class to apply on each item.
   */
  classNameItem: PropTypes.string,

  /**
   * Padding left to apply on each level.
   */
  padding: PropTypes.number,

  /**
   * Determine if the component's state is controlled by the parent via props or internally.
   */
  controlled: PropTypes.bool,

  /**
   * Determine if the item is hidden in the tree or not.
   *
   * @param {object} item The item to hide or not.
   *
   * @return {bool} true if the item is not displayed in the tree
   */
  isItemHidden: PropTypes.func,

  /**
   * Callback called on each modification of an item.
   *
   * @param {object} item The item modified.
   * @param {object} tree The current tree.
   */
  onItemChange: PropTypes.func,

  /**
   * Callback called after a set of item's change events were triggered.
   *
   * @param {object} tree The current tree.
   */
  onUpdate: PropTypes.func,

  /**
   * Custom function to render an item in the tree.
   *
   * @param {object} item The item to render.
   * @param {object} provided The option provided by @atlaskit/tree.
   *
   * @return {node} A jsx node.
   */
  renderItem: PropTypes.func,

  /**
   * Callback called on each toggle event.
   *
   * @param {object} item The item toggled.
   */
  onItemToggle: PropTypes.func,
};

const defaultProps = {
  tree: null,
  className: 'tm-layer-tree',
  classNameItem: 'tm-layer-tree-item',
  padding: 30,
  controlled: true,
  isItemHidden: () => false,
  onItemChange: () => {},
  onItemToggle: () => {},
  onUpdate: () => {},
  renderItem: null,
};

class LayerTree extends PureComponent {
  static isFirstLevel(item) {
    return item.parentId === 'root';
  }

  constructor(props) {
    super(props);
    const { tree, controlled } = this.props;
    if (!controlled) {
      this.state = {
        tree: { ...tree },
      };
    }

    // Prefix used for the name of inputs. This allows multiple LayerTree on the same page.
    this.prefixInput = shortid.generate();
  }

  onToggle(item) {
    const { onItemToggle } = this.props;
    onItemToggle(item);
  }

  onInputClick(item) {
    const { onItemChange } = this.props;
    onItemChange(item.id);
  }

  getTree() {
    const { controlled } = this.props;
    if (controlled) {
      const { tree } = this.props;
      return tree;
    }
    const { tree } = this.state;
    return tree;
  }

  renderInput(item) {
    let tabIndex = 0;

    if (!item.hasChildren || LayerTree.isFirstLevel(item)) {
      // We forbid focus on keypress event for first level items and items without children.
      tabIndex = -1;
    }

    return (
      <label // eslint-disable-line
        className={`tm-layertree-input-${item.type}`}
        tabIndex={tabIndex}
        onKeyPress={e => e.which === 13 && this.onInputClick(item)}
      >
        <input
          type={item.type}
          tabIndex={-1}
          name={this.prefixInput + item.parentId + item.type}
          checked={item.isChecked}
          onChange={() => {}}
          onClick={() => {
            this.onInputClick(item);
          }}
        />
        <span />
      </label>
    );
  }

  static renderArrow(item) {
    if (!item.hasChildren) {
      return null;
    }
    return (
      <div
        className={`tm-arrow ${
          item.isExpanded ? 'tm-arrow-up' : 'tm-arrow-down'
        }`}
      />
    );
  }

  // This function is only used to display an outline on focus around all the item of the first level.
  renderBarrierFreeDiv(item) {
    if (!LayerTree.isFirstLevel(item)) {
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

  // Render a button which expands/collapse the item if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(item) {
    let tabIndex = 0;
    let onClick = this.onToggle.bind(this);

    if (LayerTree.isFirstLevel(item)) {
      // We forbid focus on the first level items using keypress.
      tabIndex = -1;
    }

    if (!item.hasChildren) {
      onClick = this.onInputClick.bind(this);
    }

    return (
      <Button
        role="button"
        style={{ display: 'flex' }}
        tabIndex={tabIndex}
        className=""
        onClick={() => {
          onClick(item);
        }}
      >
        <div>{item.data.title}</div>
        {LayerTree.renderArrow(item)}
      </Button>
    );
  }

  renderItem(item) {
    const { renderItem, isItemHidden } = this.props;
    if (isItemHidden(item)) {
      return null;
    }

    if (renderItem) {
      return renderItem(item);
    }

    return (
      <>
        {this.renderBarrierFreeDiv(item)}
        {this.renderInput(item)}
        {this.renderToggleButton(item)}
      </>
    );
  }

  render() {
    const tree = this.getTree();
    const { padding, className, classNameItem } = this.props;

    return (
      <div className={className}>
        <Tree
          tree={tree}
          renderItem={({ item, provided }) => (
            <div
              className={classNameItem}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {this.renderItem(item)}
            </div>
          )}
          offsetPerLevel={padding}
        />
      </div>
    );
  }
}

LayerTree.propTypes = propTypes;
LayerTree.defaultProps = defaultProps;

export default LayerTree;
