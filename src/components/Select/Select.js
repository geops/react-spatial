import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * CSS class of the select.
   */
  className: PropTypes.string,

  /**
   * Array of values to use in the select element.
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
   * Selected option object.
   */
  value: PropTypes.oneOfType([
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

  /**
   * Function triggered on select's change event.
   * @param {Event} event The change event object.
   */
  onChange: PropTypes.func.isRequired,
};

const defaultProps = {
  value: undefined,
  options: undefined,
  className: 'tm-select',
};

const getSelectedOption = (inputValue, options) => {
  return options.find(
    opt =>
      (typeof opt === 'string' && opt === inputValue) ||
      opt.value === inputValue ||
      (opt.value && opt.value.toString && opt.value.toString() === inputValue),
  );
};

const getValue = opt => {
  return typeof opt === 'string' ? opt : opt.value;
};

const getLabel = opt => {
  return typeof opt === 'string' ? opt : opt.label;
};

/**
 * This component displays a simple select HTML element.
 */
const Select = props => {
  const { value, className, options, onChange } = props;
  if (!options) {
    return null;
  }
  const inputValue = getValue(value);

  return (
    <select
      className={className}
      value={inputValue}
      onChange={evt => {
        onChange(evt, getSelectedOption(evt.target.value, options));
      }}
    >
      {(options || []).map(o => (
        <option key={getValue(o)} value={getValue(o)}>
          {getLabel(o)}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
