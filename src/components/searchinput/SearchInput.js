import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import Button from '../button/Button';

const propTypes = {
  /**
   * Value of the input
   */
  value: PropTypes.string,

  /**
   * CSS class of the container (input+button).
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
   * Function triggered when the search button is clicked.
   * element.
   */
  onClickSearchButton: PropTypes.func,

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
  className: 'tm-search-input',
  placeholder: '',
  titleClearBt: '',
  titleSearchBt: '',
  titleSearchInput: '',
  onFocus: () => {},
  onBlurInput: () => {},
  onClickSearchButton: () => {},
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
      button,
      className,
      value,
      placeholder,
      titleClearBt,
      titleSearchBt,
      titleSearchInput,
      onClickSearchButton,
    } = this.props;
    const { focus } = this.state;

    // Hide clear button
    const display = !value ? 'none' : undefined;

    let newClassName = className || '';
    if (focus) {
      newClassName = `${newClassName} tm-focus`;
    }

    return (
      <div className={newClassName}>
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
          style={
            display && {
              display,
            }
          }
          onClick={e => {
            this.search(e, '');
            this.setState({ focus: true });
          }}
        >
          <MdClose focusable={false} />
        </Button>
        <Button
          title={titleSearchBt}
          onClick={e => {
            this.search(e);
            onClickSearchButton(e);
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
