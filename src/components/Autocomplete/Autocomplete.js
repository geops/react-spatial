import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import SearchInput from '../SearchInput';
import List from '../List';

const propTypes = {
  /**
   * Content for submit button.
   */
  button: PropTypes.any,

  /**
   * Value of the input.
   */
  value: PropTypes.string,

  /**
   * Placeholder of the input.
   */
  placeholder: PropTypes.string,

  /**
   * Items to display on input change.
   */
  items: PropTypes.array,

  /**
   * Items always display in suggestions list.
   */
  defaultItems: PropTypes.array,

  /**
   * Function that render the title display on top the default items list.
   */
  renderTitle: PropTypes.func,

  /**
   * Function that render an item.
   */
  renderItem: PropTypes.func,

  /**
   * Function triggered on input change, focus, and on button click.
   */
  onChange: PropTypes.func,

  /**
   * Function triggered on item selection and on click outside the autocomplete
   * element.
   */
  onSelect: PropTypes.func,

  /**
   * Function triggered when the autocomplete component (input, buttons and list) get the focus.
   * element.
   */
  onFocus: PropTypes.func,

  /**
   * Function triggered when the autocomplete component (input, buttons and list) loose the focus.
   * element.
   */
  onBlur: PropTypes.func,

  /**
   * Get the key for each item used when react creates the list.
   */
  getItemKey: PropTypes.func,

  /**
   * CSS class added to container.
   */
  className: PropTypes.string,

  /**
   * CSS class added to container of the results list.
   */
  classNameResults: PropTypes.string,
};

const defaultProps = {
  button: 'submit',
  value: '',
  placeholder: '',
  items: [],
  defaultItems: [],
  renderTitle: t => t,
  renderItem: i => i,
  getItemKey: k => k,
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  onSelect: () => {},
  className: 'tm-autocomplete',
  classNameResults: 'tm-autocomplete-results',
};

/**
 * This component displays a search input with a list of suggestions.
 */
class Autocomplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      refList: null,
      focus: false,
    };
    this.onDocClick = this.onDocClick.bind(this);
    this.ref = null;
    this.refSearchInput = null;
  }

  componentDidMount() {
    // Close the list when clicking outside the list or the input
    document.addEventListener('click', this.onDocClick);
  }

  componentDidUpdate(prevProps, prevState) {
    // Close the list when clicking outside the list or the input
    document.addEventListener('click', this.onDocClick);

    // Trigger onFocus and onBlur event
    const { focus } = this.state;
    const { onBlur, onFocus } = this.props;
    if (prevState.focus && !focus) {
      onBlur();
    } else if (!prevState.focus && focus) {
      onFocus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocClick);
  }

  onDocClick(e) {
    // If the click comes from an element of Autocomplete, don't close the list.
    if (this.ref && this.ref.contains(e.target)) {
      return;
    }
    this.setState({ showList: false, focus: false });
  }

  onChange(evt, val) {
    const { onChange } = this.props;
    this.setState({ showList: true, focus: true });
    onChange(val);
  }

  onFocus() {
    this.setState({ showList: true, focus: true });
  }

  onBlurInput(evt, lastKeyPress) {
    if (lastKeyPress && lastKeyPress.which !== 40) {
      this.setState({ showList: false, focus: false });
    }
  }

  onKeyPress(evt) {
    if (evt.which === 40) {
      const { refList } = this.state;
      if (refList) {
        // Give focus to the first element of the results
        if (refList.querySelector('.tm-list-item')) {
          // eslint-disable-next-line react/no-find-dom-node
          refList.querySelector('.tm-list-item').focus();
        }
      }
    }
  }

  onKeyPressItem(evt) {
    if (evt.which !== 40 && evt.which !== 38) {
      return;
    }
    let delta = 1;
    if (evt.which === 38) {
      delta = -1;
    }
    const { refList } = this.state;
    const liFocused = document.activeElement;
    const lis = refList.querySelectorAll('.tm-list-item');
    if (!lis.length) {
      return;
    }
    const idxItemFocused = Array.prototype.slice.call(lis).indexOf(liFocused);
    let nextIndex = idxItemFocused + delta;
    if (nextIndex < 0) {
      // Move focus to input search
      // eslint-disable-next-line react/no-find-dom-node
      ReactDOM.findDOMNode(this.refSearchInput)
        .querySelector('input')
        .focus();
      nextIndex = lis.length - 1;
      return;
    }
    if (nextIndex === lis.length) {
      // Move focus to the beginning of the list
      nextIndex = 0;
    }
    lis[nextIndex].focus();
  }

  onSelect(evt, item) {
    const { onSelect } = this.props;
    onSelect(item);
    this.setState({ showList: false, focus: false });
  }

  render() {
    const {
      button,
      value,
      placeholder,
      items,
      defaultItems,
      renderTitle,
      renderItem,
      getItemKey,
      className,
      classNameResults,
    } = this.props;
    const { showList, refList } = this.state;
    const display =
      !showList || (!items.length && !defaultItems.length) ? 'none' : null;
    const hr = items.length && defaultItems.length ? <hr /> : null;

    return (
      <div
        className={className}
        ref={node => {
          this.ref = node;
        }}
      >
        <SearchInput
          button={button}
          value={value}
          placeholder={placeholder}
          onChange={(e, val) => this.onChange(e, val)}
          onFocus={e => this.onFocus(e)}
          onKeyPress={e => this.onKeyPress(e)}
          onBlurInput={(e, keyPress) => this.onBlurInput(e, keyPress)}
          onClickSearchButton={() => {
            if (showList) {
              this.setState({ showList: false, focus: false });
            }
          }}
          ref={node => {
            this.refSearchInput = node;
          }}
        />
        <div
          ref={node => {
            if (node && !refList) {
              this.setState({ refList: node });
            }
          }}
          style={
            display && {
              display,
            }
          }
          className={classNameResults}
        >
          <List
            items={items}
            renderItem={item => renderItem(item)}
            getItemKey={item => getItemKey(item)}
            onSelect={(e, item) => {
              this.onSelect(e, item);
            }}
            onKeyDownItem={e => {
              this.onKeyPressItem(e);
            }}
          />
          {hr}
          {renderTitle()}
          <List
            items={defaultItems}
            renderItem={item => renderItem(item)}
            getItemKey={item => getItemKey(item)}
            onSelect={(e, item) => {
              this.onSelect(e, item);
            }}
            onKeyDownItem={e => {
              this.onKeyPressItem(e);
            }}
          />
        </div>
      </div>
    );
  }
}

Autocomplete.propTypes = propTypes;
Autocomplete.defaultProps = defaultProps;

export default Autocomplete;
