/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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

  /**
   * Render method to render a different color picker.
   */
  renderColorPicker: PropTypes.func,
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
  renderColorPicker: null,
};

const defaultRenderColorPicker = (selectedColor, colors, onChange) => {
  const arrHexa = colors.map(c => {
    return asString(c.fill);
  });

  return (
    <GithubPicker
      colors={arrHexa}
      width={150}
      onChange={(c, evt) => {
        const { r, g, b, a } = c.rgb;
        const idx = arrHexa.indexOf(asString([r, g, b, a]));
        onChange(colors[idx], evt);
      }}
    />
  );
};

const ColorPicker = ({
  colors,
  selectedColor,
  className,
  onChange,
  renderColorPicker,
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const ref = useRef();

  if (!colors) {
    return null;
  }
  // Close the list when clicking outside the list or the input
  useEffect(() => {
    const onDocClick = e => {
      // If the click comes from an element of Autocomplete, don't close the list.
      if (ref && ref.current && ref.current.contains(e.target)) {
        return;
      }
      setDisplayColorPicker(false);
    };
    if (displayColorPicker) {
      document.addEventListener('click', onDocClick);
    }
    return function cleanup() {
      document.removeEventListener('click', onDocClick);
    };
  }, [displayColorPicker]);

  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <div className={className} ref={ref}>
      <Button onClick={() => setDisplayColorPicker(!displayColorPicker)}>
        <div
          style={{
            backgroundColor: selectedColor && selectedColor.name,
          }}
        />
      </Button>
      {displayColorPicker && (
        <>
          {(renderColorPicker || defaultRenderColorPicker)(
            selectedColor,
            colors,
            onChange,
          )}
        </>
      )}
    </div>
  );
};

ColorPicker.propTypes = propTypes;
ColorPicker.defaultProps = defaultProps;

export default ColorPicker;
