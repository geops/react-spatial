import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tree, { mutateTree } from '@atlaskit/tree';

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
      }),
    ).isRequired,
  }),
  padding: PropTypes.number,

  /**
   * Callback called on each modification of an item.
   *
   * @param {object} item The item modified.
   * @param {object} tree The current tree.
   */
  onItemChange: PropTypes.func,
};

const defaultProps = {
  tree: null,
  padding: 16,
  onItemChange: () => {},
};

class LayerTree extends PureComponent {
  static isFirstLevel(tree, item) {
    return item.parendId === tree.rootId;
  }

  static areOthersSiblingsUncheck(tree, item) {
    const parent = tree.items[item.parentId];
    if (!parent) {
      return false;
    }
    return !parent.children
      .filter(id => id !== item.id)
      .find(id => tree.items[id].isChecked);
  }

  static areAllSiblingsUncheck(tree, item) {
    const parent = tree.items[item.parentId];
    if (!parent) {
      return false;
    }
    return !parent.children.find(id => tree.items[id].isChecked);
  }

  constructor(props) {
    super(props);
    this.state = {
      tree: { ...props.tree },
    };
  }

  onExpand(item) {
    const { tree } = this.state;
    let newTree = tree;

    if (item.type === 'radio') {
      newTree = this.mutateTree(newTree, item.id, {
        isExpanded: true,
        isChecked: true,
      });

      if (item.parentId) {
        newTree = this.mutateTree(newTree, item.parentId, {
          isChecked: true,
        });
        tree.items[item.parentId].children.forEach(childId => {
          const child = tree.items[childId];

          if (child.id === item.id) {
            return;
          }

          const val = false;
          if (child.isChecked === val || child.isExpanded === val) {
            return;
          }

          newTree = this.mutateTree(newTree, childId, {
            isExpanded: val,
            isChecked: val,
          });
        });
      }
    } else {
      newTree = this.mutateTree(newTree, item.id, {
        isExpanded: true,
      });
    }

    this.setState({
      tree: newTree,
    });
  }

  onCollapse(item) {
    const { tree } = this.state;
    this.setState({
      tree: this.mutateTree(tree, item.id, { isExpanded: false }),
    });
  }

  onChecked(item, value) {
    const { tree } = this.state;
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
          item,
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

      // On check/uncheck, check/uncheck all the childrens.
      newTree = this.applyToChildren(newTree, item, mutation);
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

    // Apply to parents if all the others siblings are uncheck.
    if (LayerTree.areOthersSiblingsUncheck(newTree, item)) {
      newTree = this.applyToItem(newTree, parent, mutation);
      newTree = this.applyToParents(newTree, parent, mutation);
    }
    return newTree;
  }

  /**
   * Apply a mutation to all the chidlren recursively.
   */
  applyToChildren(tree, item, mutation, itemIgnored) {
    let newTree = tree;
    let newMutation = { ...mutation };

    // Go through all the children.
    tree.items[item.id].children.forEach(childId => {
      const child = newTree.items[childId];
      if (itemIgnored && child.id === itemIgnored.id) {
        return;
      }

      // If no mutation provided we apply the default values.
      if (!mutation && child.defaults) {
        newMutation = { ...child.defaults };
      } else if (!mutation) {
        // If no mutation provided, we do nothing.
        return;
      }

      newTree = this.applyToItem(newTree, child, newMutation);

      if (child.hasChildren) {
        newTree = this.applyToChildren(
          newTree,
          child,
          newMutation,
          itemIgnored,
        );
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

  renderItem({ item, onExpand, onCollapse, provided }) {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <input
          type={item.type}
          name={item.parentId}
          checked={item.isChecked}
          onChange={() => {}}
          onClick={evt => {
            if (item.type === 'radio' && item.isChecked) {
              this.onChecked(item, false);
            } else {
              this.onChecked(item, evt.target.checked);
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            if (!item.hasChildren) {
              return;
            }
            if (item.isExpanded) {
              onCollapse(item);
            } else {
              onExpand(item);
            }
          }}
        >
          {item.data.title}
        </button>
      </div>
    );
  }

  render() {
    const { tree } = this.state;
    const { padding } = this.props;
    return (
      <Tree
        tree={tree}
        renderItem={(item, onExpand, onCollapse, provided) =>
          this.renderItem(item, onExpand, onCollapse, provided)
        }
        onExpand={item => this.onExpand(item)}
        onCollapse={item => this.onCollapse(item)}
        offsetPerLevel={padding}
      />
    );
  }
}

LayerTree.propTypes = propTypes;
LayerTree.defaultProps = defaultProps;

export default LayerTree;
