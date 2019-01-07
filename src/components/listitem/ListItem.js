import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Item of the list.
   */
  item: PropTypes.any.isRequired,

  /**
   * Children content of the button.
   */
  children: PropTypes.node.isRequired,

  /**
   * Function triggered when you select the item.
   */
  onSelect: PropTypes.func,

  /**
   * Function triggered when you press a key.
   */
  onKeyDown: PropTypes.func,
};

const defaultProps = {
  onSelect: () => {},
  onKeyDown: () => {},
};

/**
 * This component  displays a <li> tag.
 */
class ListItem extends PureComponent {
  render() {
    const { children, item, onSelect, onKeyDown } = this.props;
    return (
      <li
        className="tm-list-item"
        role="menuitem"
        tabIndex="0"
        onClick={e => {
          onSelect(e, item);
        }}
        onKeyPress={e => e.which === 13 && onSelect(e, item)}
        onKeyDown={e => {
          onKeyDown(e);
        }}
      >
        {children}
      </li>
    );
  }
}

ListItem.propTypes = propTypes;
ListItem.defaultProps = defaultProps;

export default ListItem;
