import React from 'react';
import PropTypes from 'prop-types';

const optionPropType = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string,
});

const propTypes = {
  /**
   * Array of values to use in the select element.
   */
  options: PropTypes.arrayOf(optionPropType).isRequired,

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
};

/**
 * This component displays a simple select HTML element.
 */
const Select = ({ options, value, onChange }) => (
  <select
    className="tm-select"
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

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
