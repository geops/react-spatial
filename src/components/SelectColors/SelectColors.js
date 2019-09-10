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
const SelectColors = function(props) {
  const { options } = props;
  const { className } = props;
  const { onChange } = props;
  if (!options) {
    return null;
  }

  return React.createElement(
    'select',
    {
      className,
      onChange(evt) {
        onChange(evt.target.value);
      },
    },
    (options || []).map(function(c) {
      return React.createElement('option', {
        key: c.name,
        value: c.name,
        style: { backgroundColor: `rgba(${c.fill})` },
      });
    }),
  );
};

SelectColors.propTypes = propTypes;
SelectColors.defaultProps = defaultProps;

export default SelectColors;
