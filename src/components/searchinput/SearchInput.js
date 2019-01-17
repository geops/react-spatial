import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import Button from '../button/Button';

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
   * Function launched when the user press a key on the input and the list.
   */
  onKeyPress: PropTypes.func,

  /**
   * Function launched when the user change the content of the input.
   */
  onChange: PropTypes.func,

  /**
   * Content for submit button.
   */
  button: PropTypes.any,

  /**
   * Title for the clear button.
   */
  titleClearBt: PropTypes.string,

  /**
   * Title for the search button.
   */
  titleSearchBt: PropTypes.string,

  /**
   * Title for the input text.
   */
  titleSearchInput: PropTypes.string,
};

const defaultProps = {
  button: 'search',
  value: '',
  className: null,
  placeholder: '',
  titleClearBt: '',
  titleSearchBt: '',
  titleSearchInput: '',
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
    this.refInput = null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { focus } = this.state;
    if (this.refInput && focus && focus !== prevState.focus) {
      this.refInput.focus();
    }
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
   * Trigger the onChange function with a new value or the current value of
   * the input.
   */
  search(evt, newVal) {
    const { value, onChange } = this.props;
    if (newVal !== undefined && newVal !== null) {
      onChange(evt, newVal);
    } else {
      onChange(evt, value);
    }
  }

  render() {
    const {
      button, value, placeholder, titleClearBt, titleSearchBt, titleSearchInput
    } = this.props;

    const className = this.getClassName();

    // Hide clear button
    let hiddenClass = 'tm-hidden';
    if (value) {
      hiddenClass = ''
    }

    return (
      <div className={className}>
        <input
          value={value}
          type="text"
          tabIndex="0"
          placeholder={placeholder}
          title={titleSearchInput}
          onChange={e => this.search(e, e.target.value)}
          onBlur={e => this.onBlur(e)}
          onFocus={e => this.onFocus(e)}
          onKeyDown={e => this.onKeyDown(e)}
          onKeyUp={e => this.onKeyUp(e)}
          ref={node => {
            this.refInput = node;
          }}
        />
        <Button
          title={titleClearBt}
          className={hiddenClass}
          onClick={e => {
            this.search(e, '');
            this.setState({ focus: true });
          }}
        >
          <MdClose focusable={false} />
        </Button>
        <Button
          title={titleSearchBt}
          className="tm-bt-search"
          onClick={e => {
            this.search(e);
          }}
        >
          {button}
        </Button>
      </div>
    );
  }
}

SearchInput.propTypes = propTypes;
SearchInput.defaultProps = defaultProps;

export default SearchInput;
