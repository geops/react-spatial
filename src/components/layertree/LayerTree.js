import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tree from '@atlaskit/tree';
import shortid from 'shortid';

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
   * @return {object} jsx code.
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
  classNameItem: 'tm-layertree-item',
  padding: 30,
  controlled: true,
  isItemHidden: () => false,
  onItemChange: () => {},
  onItemToggle: () => {},
  onUpdate: () => {},
  renderItem: null,
};

class LayerTree extends PureComponent {
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
    return (
      <label // eslint-disable-line
        className={`tm-layertree-input-${item.type}`}
        tabIndex="0"
        onKeyPress={e => {
          if (e.which === 13) {
            this.onInputClick(item);
          }
        }}
      >
        <input
          type={item.type}
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

  renderToggleButton(item) {
    if (!item.hasChildren) {
      return null;
    }
    return (
      <button
        className={`tm-arrow ${
          item.isExpanded ? 'tm-arrow-up' : 'tm-arrow-down'
        }`}
        type="button"
        onClick={() => {
          this.onToggle(item);
        }}
      />
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
        {this.renderInput(item)}
        <div>{item.data.title}</div>
        {this.renderToggleButton(item)}
      </>
    );
  }

  render() {
    const tree = this.getTree();
    const { padding, classNameItem } = this.props;

    return (
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
    );
  }
}

LayerTree.propTypes = propTypes;
LayerTree.defaultProps = defaultProps;

export default LayerTree;
