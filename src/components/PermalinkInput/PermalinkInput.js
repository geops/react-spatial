import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdContentCopy } from 'react-icons/md';
import Button from '../Button';

const propTypes = {
  /**
   * Value of the permalink
   */
  value: PropTypes.string,

  /**
   * CSS class of the container (input+button).
   */
  className: PropTypes.string,

  /**
   * CSS class of the input field.
   */
  classNameInputField: PropTypes.string,

  /**
   * CSS class of the copy button.
   */
  classNameCopyBt: PropTypes.string,

  /**
   * Content for copy button.
   */
  button: PropTypes.any,

  /**
   * Title for the copy button.
   */
  titleCopyBt: PropTypes.string,

  /**
   * Title for the input field.
   */
  titleInputField: PropTypes.string,

  /**
   * Callback function to get a shortened URL.
   */
  getShortenedUrl: PropTypes.func,
};

const defaultProps = {
  value: '',
  className: 'tm-permalink-field',
  classNameInputField: 'tm-permalink-input',
  classNameCopyBt: 'tm-permalink-bt',
  titleCopyBt: '',
  titleInputField: '',
  button: <MdContentCopy focusable={false} />,
  getShortenedUrl: val => {
    return new Promise(resolve => {
      return resolve(val);
    });
  },
};

/**
 * This component displays a permalink field.
 */
class PermalinkInput extends PureComponent {
  static selectInput() {
    document.execCommand('selectall');
  }

  constructor(props) {
    super(props);
    this.state = { permalinkValue: null };
    this.inputRef = null;
  }

  componentDidMount() {
    const { value, getShortenedUrl } = this.props;
    getShortenedUrl(value).then(permalinkValue => {
      this.setState({ permalinkValue });
    });
  }

  componentDidUpdate(prevProps) {
    this.updatePermalinkValue(prevProps);
  }

  onClickCopyButton() {
    if (this.inputRef) {
      this.inputRef.select();
    }
    document.execCommand('copy');
  }

  updatePermalinkValue(prevProps) {
    const { value, getShortenedUrl } = this.props;

    if (value !== prevProps.value) {
      getShortenedUrl(value).then(v => {
        this.setState({ permalinkValue: v });
      });
    }
  }

  render() {
    const {
      button,
      className,
      classNameInputField,
      classNameCopyBt,
      titleCopyBt,
      titleInputField,
    } = this.props;

    const { permalinkValue } = this.state;

    if (permalinkValue) {
      return (
        <div className={className}>
          <input
            value={permalinkValue}
            readOnly
            type="text"
            tabIndex="0"
            title={titleInputField}
            className={classNameInputField}
            ref={node => {
              this.inputRef = node;
            }}
            onClick={() => PermalinkInput.selectInput()}
          />
          <Button
            className={classNameCopyBt}
            title={titleCopyBt}
            onClick={() => {
              this.onClickCopyButton();
            }}
          >
            {button}
          </Button>
        </div>
      );
    }
    return null;
  }
}

PermalinkInput.propTypes = propTypes;
PermalinkInput.defaultProps = defaultProps;

export default PermalinkInput;
