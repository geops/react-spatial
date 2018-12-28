import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import StopEvents from '../stopevents/StopEvents';
import { ReactComponent as SearchIcon } from '../../img/icons/search.svg';

import './SearchInput.scss';

const propTypes = {
  /**
   * Value of the input
   */
  value: PropTypes.string,

  /**
   * CSS Class of the container (input+button).
   */
  className: PropTypes.string,

  /**
   * Placeholder of the input.
   */
  placeholder: PropTypes.string,

  /**
   * Function launched when the input has the focus.
   */
  onFocus: PropTypes.func,

  /**
   * Function launched when the input looses the focus.
   */
  onBlurInput: PropTypes.func,

  /**
   * Function launched when the user press a key on the input and the bottom.
   */
  onKeyPress: PropTypes.func,

  /**
   * Function launched when the user change the content of the input.
   */
  onChange: PropTypes.func,
};

const defaultProps = {
  value: '',
  className: null,
  placeholder: '',
  onFocus: () => {},
  onBlurInput: () => {},
  onKeyPress: () => {},
  onChange: () => {},
};


/**
 * This component displays a search input
 */
class SearchInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
    };
  }

  onFocus(evt) {
    this.setState({ focus: true });
    const { onFocus } = this.props;
    onFocus(evt);
  }

  onBlur(evt) {
    this.setState({ focus: false });
    const { onBlurInput } = this.props;
    onBlurInput(evt.nativeEvent, this.lastKeyPress);
  }

  onKeyUp(evt) {
    if (evt.which === 13) {
      this.search(evt);
    }
    const { onKeyPress } = this.props;
    onKeyPress(evt);
    this.lastKeyPress = null;
  }

  onKeyDown(evt) {
    this.lastKeyPress = evt.nativeEvent;
  }

  /**
   * Function triggered when the value of the input change.
   */
  onChange(evt) {
    const { onChange } = this.props;
    onChange(evt, evt.target.value);
  }

  /**
   * Get the className to use for the container.
   */
  getClassName() {
    const { focus } = this.state;
    const { className } = this.props;
    const newClassName = `tm-search-input ${className || ''}`;
    if (focus) {
      return `${newClassName} tm-focus`;
    }
    return newClassName;
  }

  /**
   * Trigger the onChange function with the current value of the input.
   */
  search(evt) {
    const { value, onChange } = this.props;
    onChange(evt, value);
  }

  render() {
    const { value, placeholder } = this.props;
    const className = this.getClassName();
    return (
      <div className={className}>
        <StopEvents observe={this} events={['click']} />
        <input
          value={value}
          type="search"
          tabIndex="0"
          placeholder={placeholder}
          onChange={e => (this.onChange(e))}
          onBlur={e => (this.onBlur(e))}
          onFocus={e => (this.onFocus(e))}
          onKeyDown={e => (this.onKeyDown(e))}
          onKeyUp={e => (this.onKeyUp(e))}
        />
        <button
          type="button"
          className="tm-bt"
          tabIndex="0"
          title={placeholder}
          onMouseDown={(e) => {
            this.search(e);
          }}
          onKeyPress={e => (this.onKeyUp(e))}
        >
          <SearchIcon />
        </button>
      </div>
    );
  }
}

SearchInput.propTypes = propTypes;
SearchInput.defaultProps = defaultProps;

export default SearchInput;
