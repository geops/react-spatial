import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Function triggered on button's click event.
   */
  onClick: PropTypes.func.isRequired,

  /**
   * Boolean attribute if input is checked or not.
   */
  checked: PropTypes.bool,

  /**
   * CSS class of the checkbox.
   */
  className: PropTypes.string,

  /**
   * Is either checkbox or radio.
   */
  inputType: PropTypes.string,

  /**
   * HTML tabIndex attribute.
   */
  tabIndex: PropTypes.number,
};

const defaultProps = {
  className: 'tm-check',
  inputType: 'checkbox',
  checked: false,
  tabIndex: 0,
};

class Checkbox extends PureComponent {
  render() {
    const { className, onClick, tabIndex, inputType, checked } = this.props;
    /*
      eslint-disable jsx-a11y/label-has-associated-control,
      jsx-a11y/label-has-for
    */
    return (
      <label
        className={`${className} tm-${inputType}`}
        tabIndex={tabIndex}
        onKeyPress={e => {
          if (e.which === 13) {
            onClick();
          }
        }}
      >
        <input
          type={inputType}
          tabIndex={-1}
          checked={checked}
          onChange={() => {}}
          onClick={() => onClick()}
        />
        <span />
      </label>
    );
    /*
      eslint-enable jsx-a11y/label-has-associated-control,
      jsx-a11y/label-has-for
    */
  }
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
