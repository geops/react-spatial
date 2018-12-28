import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ListItem from '../listitem/ListItem';

import './List.scss';

const propTypes = {
  items: PropTypes.array,
  renderItem: PropTypes.func,
  onSelect: PropTypes.func,
  onKeyDownItem: PropTypes.func,
  getItemKey: PropTypes.func.isRequired,
};

const defaultProps = {
  items: [],
  renderItem: () => {},
  onSelect: () => {},
  onKeyDownItem: () => {},
};


/**
 * This component displays a <ul> HMTL tag element.
 *
 * This component also add keyboard navigation (arrow up/down, w/s) between list
 * items.
 */
class List extends PureComponent {
  render() {
    const {
      items, renderItem, onSelect, onKeyDownItem, getItemKey,
    } = this.props;

    if (!items.length) {
      return null;
    }

    return (
      <ul role="menu" className="tm-list">
        {items.map(item => (
          <ListItem
            key={getItemKey(item)}
            item={item}
            onSelect={(e, itm) => { onSelect(e, itm); }}
            onKeyDown={(e) => { onKeyDownItem(e); }}
          >
            { renderItem(item) }
          </ListItem>
        ))}
      </ul>
    );
  }
}

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export default List;
