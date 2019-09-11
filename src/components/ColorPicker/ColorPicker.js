/* eslint-disable react/jsx-no-comment-textnodes, jsx-a11y/interactive-supports-focus, jsx-a11y/control-has-associated-label,jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { GithubPicker } from 'react-color';
import Button from '../Button/Button';

const propTypes = {
  /**
   * CSS class for the container.
   */
  className: PropTypes.string,
  /**
   * Label for the container.
   */
  label: PropTypes.string,
  /**
   * onChange event handler.
   */
  onChange: PropTypes.func,
};

const defaultProps = {
  className: 'tm-color-button',
  label: 'Pick Color',
  onChange: () => {},
};

const ColorPicker = ({ className, label, onChange }) => {
  const [displayColorPicker, setdisplayColorPicker] = useState(false);

  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };

  const handleClick = () => setdisplayColorPicker(!displayColorPicker);

  const handleClose = () => setdisplayColorPicker(false);

  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <div className={className}>
      <Button onClick={() => handleClick()}>{label}</Button>
      {displayColorPicker ? (
        <div>
          <div role="button" style={cover} onClick={() => handleClose()} />
          <GithubPicker triangle="top-left" onChange={c => onChange(c)} />
        </div>
      ) : null}
    </div>
  );
};

ColorPicker.propTypes = propTypes;
ColorPicker.defaultProps = defaultProps;

export default ColorPicker;
