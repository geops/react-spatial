import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * CSS class of the selectColors.
   */
  className: PropTypes.string,

  /**
   * Array of values to use in the selectColors element.
   */
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          ),
        ]).isRequired,
        label: PropTypes.string.isRequired,
      }),
    ]),
  ),

  /**
   * Function triggered on select's change event.
   * @param {Event} event The change event object.
   */
  onChange: PropTypes.func.isRequired,
};

const defaultProps = {
  options: undefined,
  className: 'tm-selectcolors',
};

/**
 * This component displays a simple selectColors HTML element.
 */
const SelectColors = ({ options, className, onChange }) => {
  if (!options) {
    return null;
  }

  return (
    <select
      className={className}
      onChange={evt => {
        onChange(evt.target.value);
      }}
    >
      {(options || []).map(c => (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <option
          key={c.name}
          value={c.name}
          style={{ backgroundColor: `rgba(${c.fill})` }}
        />
      ))}
    </select>
  );
};

SelectColors.propTypes = propTypes;
SelectColors.defaultProps = defaultProps;

export default SelectColors;
