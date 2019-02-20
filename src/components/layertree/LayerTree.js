import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tree, { mutateTree } from '@atlaskit/tree';
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
};

const defaultProps = {
  tree: null,
  classNameItem: 'tm-layertree-item',
  padding: 30,
  controlled: true,
  isItemHidden: () => false,
  onItemChange: () => {},
  onUpdate: () => {},
  renderItem: null,
};

class LayerTree extends PureComponent {
  static areOthersSiblingsUncheck(tree, item) {
    const parent = tree.items[item.parentId];
    return !parent.children
      .filter(id => id !== item.id)
      .find(id => tree.items[id].isChecked);
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
    const tree = this.getTree();
    this.setTree(
      this.mutateTree(tree, item.id, { isExpanded: !item.isExpanded }),
    );
  }

  onInputClick(item) {
    const tree = this.getTree();
    const value = !item.isChecked;
    let newTree = tree;

    if (item.type === 'radio') {
      // An input radio automatically expand/collapse on check.
      newTree = this.mutateTree(newTree, item.id, {
        isChecked: value,
        isExpanded: item.hasChildren,
      });

      // Apply to parents if all the others siblings are uncheck.
      newTree = this.applyToParents(newTree, item, {
        isChecked: value,
      });

      // On check
      if (value) {
        // Apply the default values of children.
        newTree = this.applyToChildren(newTree, item);

        // Uncheck all the radio inputs of the same group.
        newTree = this.applyToChildren(
          newTree,
          newTree.items[item.parentId],
          {
            isChecked: !value,
            isExpanded: !value,
          },
          child => {
            if (child.id === item.id || child.type === 'checkbox') {
              return true;
            }
            return false;
          },
        );

        // On uncheck
      } else {
        // Uncheck all the children.
        newTree = this.applyToChildren(newTree, item, {
          isChecked: value,
        });
      }
    } else if (item.type === 'checkbox') {
      const mutation = { isChecked: value };
      newTree = this.mutateTree(newTree, item.id, mutation);

      // Apply to parents if all the others siblings are uncheck.
      newTree = this.applyToParents(newTree, item, mutation);

      // On check/uncheck:
      //   - for input checkbox -> check/uncheck all the children.
      //   - for input radio -> check/uncheck only one of the children.
      newTree = this.applyToChildren(newTree, item, mutation);
    }

    this.setTree(newTree);
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

  setTree(newTree) {
    const { controlled, onUpdate } = this.props;
    if (controlled) {
      onUpdate(newTree);
      return;
    }

    this.setState({
      tree: newTree,
    });
  }

  applyToItem(tree, item, mutation) {
    let newTree = tree;
    const newMutation = { ...mutation };

    // We remove all the unecessary mutations.
    Object.keys({ ...mutation }).forEach(key => {
      if (item[key] === mutation[key]) {
        delete newMutation[key];
      }
    });

    // No mutation to apply
    if (!Object.keys(newMutation).length) {
      return newTree;
    }

    newTree = this.mutateTree(newTree, item.id, newMutation);
    return newTree;
  }

  /**
   * Apply a mutation to all the parents recursively.
   */
  applyToParents(tree, item, mutation) {
    let newTree = tree;
    const parent = newTree.items[item.parentId];

    if (!parent) {
      return newTree;
    }

    // if parent is radio input going to be checked
    if (parent.type === 'radio') {
      const radioSiblings = parent.children.filter(
        id =>
          id !== item.id &&
          tree.items[id].type === 'radio' &&
          tree.items[id].isChecked === true,
      );
      // Uncheck all radio siblings and their children.
      const newMutation = {
        isChecked: false,
        isExpanded: false,
      };

      for (let i = 0; i < radioSiblings.length; i += 1) {
        newTree = this.applyToItem(
          newTree,
          newTree.items[radioSiblings[i]],
          newMutation,
        );
        newTree = this.applyToChildren(
          newTree,
          newTree.items[radioSiblings[i]],
          newMutation,
        );
      }
    }

    // Apply to parents if all the others siblings are uncheck.
    if (LayerTree.areOthersSiblingsUncheck(newTree, item)) {
      newTree = this.applyToItem(newTree, parent, mutation);
      newTree = this.applyToParents(newTree, parent, mutation);
    }
    return newTree;
  }

  /**
   * Apply a mutation to all the children recursively.
   */
  applyToChildren(tree, item, mutation, isIgnored) {
    let newTree = tree;
    let newMutation = { ...mutation };
    let firstRadioInput;

    // Go through all the children.
    tree.items[item.id].children.forEach(childId => {
      const child = newTree.items[childId];

      if (isIgnored !== undefined && isIgnored(child)) {
        return;
      }

      // If no mutation provided we apply the default values.
      if (!mutation && child.defaults) {
        newMutation = { ...child.defaults };
      } else if (!mutation) {
        // If no mutation provided, we do nothing.
        return;
      }

      // if a radio input is going to be checked, uncheck all the other member of the group.
      if (firstRadioInput && newMutation.isChecked && child.type === 'radio') {
        // Uncheck all the radio inputs of the same group.
        newTree = this.applyToItem(newTree, child, {
          isChecked: false,
          isExpanded: false,
        });
        return;
      }

      newTree = this.applyToItem(newTree, child, newMutation);

      // Set isRadioInput to true will ignore the other member of radio group.
      if (!firstRadioInput && child.type === 'radio') {
        firstRadioInput = child;
      }

      if (child.hasChildren) {
        newTree = this.applyToChildren(newTree, child, newMutation);
      }
    });
    return newTree;
  }

  mutateTree(tree, itemId, mutation) {
    const { onItemChange } = this.props;
    const newTree = mutateTree(tree, itemId, mutation);
    onItemChange(newTree.items[itemId], newTree);
    return newTree;
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
