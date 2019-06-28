import React, { useState, useRef, useEffect } from 'react';
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

const selectInput = inputRef => {
  inputRef.current.select();
  document.execCommand('selectall');
};

const onClickCopyButton = inputRef => {
  inputRef.current.select();
  document.execCommand('copy');
};

function PermalinkInput({
  value,
  button,
  className,
  classNameInputField,
  classNameCopyBt,
  titleCopyBt,
  titleInputField,
  getShortenedUrl,
}) {
  const [permalinkValue, setPermalinkValue] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    getShortenedUrl(value).then(v => {
      setPermalinkValue(v);
    });
  });

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
          ref={inputRef}
          onClick={() => selectInput(inputRef)}
        />
        <Button
          className={classNameCopyBt}
          title={titleCopyBt}
          onClick={() => onClickCopyButton(inputRef)}
        >
          {button}
        </Button>
      </div>
    );
  }
  return null;
}

PermalinkInput.propTypes = propTypes;
PermalinkInput.defaultProps = defaultProps;

export default PermalinkInput;
