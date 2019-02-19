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
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,

  /**
   * Selected option object.
   */
  value: PropTypes.string,

  /**
   * Function triggered on select's change event.
   * @param {Event} event The change event object.
   */
  onChange: PropTypes.func.isRequired,
};

const defaultProps = {
  value: undefined,
  className: 'tm-select',
};

/**
 * This component displays a simple select HTML element.
 */
const Select = props => {
  const { value, className, options, onChange } = props;
  return (
    <select
      className={className}
      value={value}
      onChange={evt => onChange(evt, evt.target.value)}
    >
      {(options || []).map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
