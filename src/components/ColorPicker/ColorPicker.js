/* eslint-disable react/jsx-no-comment-textnodes, jsx-a11y/interactive-supports-focus, jsx-a11y/control-has-associated-label,jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { GithubPicker } from 'react-color';
import { asString } from 'ol/color';
import Button from '../Button/Button';

const propTypes = {
  /**
   * CSS class for the container.
   */
  className: PropTypes.string,
  /**
   * onChange event handler.
   */
  onChange: PropTypes.func,
  /**
   * List of colors available for modifcation.
   */
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      fill: PropTypes.array,
      border: PropTypes.string,
    }),
  ),
  /**
   * Currently selected color
   */
  selectedColor: PropTypes.shape({
    name: PropTypes.string,
    fill: PropTypes.array,
    border: PropTypes.string,
  }),
};

const defaultProps = {
  className: 'tm-color-picker',
  onChange: () => {},
  colors: [
    { name: 'none', fill: [255, 255, 255, 0.01], border: 'white' },
    { name: 'black', fill: [0, 0, 0, 1], border: 'white' },
    { name: 'blue', fill: [0, 0, 255, 1], border: 'white' },
    { name: 'gray', fill: [128, 128, 128, 1], border: 'white' },
    { name: 'green', fill: [0, 128, 0, 1], border: 'white' },
    { name: 'orange', fill: [255, 165, 0, 1], border: 'black' },
    { name: 'red', fill: [255, 0, 0, 1], border: 'white' },
    { name: 'white', fill: [255, 255, 255, 1], border: 'black' },
    { name: 'yellow', fill: [255, 255, 0, 1], border: 'black' },
  ],
  selectedColor: { name: 'black', fill: [0, 0, 0, 1], border: 'white' },
};

const cover = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
};

const ColorPicker = ({ colors, selectedColor, className, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => setDisplayColorPicker(!displayColorPicker);

  const handleClose = () => setdisplayColorPicker(false);

  if (!colors) {
    return null;
  }
  const arrHexa = colors.map(c => {
    return asString(c.fill);
  });
  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <div className={className}>
      <Button
        className="tm-color-button"
        style={{
          backgroundColor: selectedColor && selectedColor.name,
        }}
        onClick={() => handleClick()}
      >
        <span />
      </Button>

      {displayColorPicker ? (
        <div>
          <div style={cover} onClick={() => handleClose()} />
          <GithubPicker
            colors={arrHexa}
            triangle="top-left"
            onChange={(c, evt) => {
              const { r, g, b, a } = c.rgb;
              const idx = arrHexa.indexOf(asString([r, g, b, a]));
              onChange(colors[idx], evt);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

ColorPicker.propTypes = propTypes;
ColorPicker.defaultProps = defaultProps;

export default ColorPicker;
