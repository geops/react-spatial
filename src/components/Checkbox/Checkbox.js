import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Function triggered on button's click event.
   */
  onClick: PropTypes.func.isRequired,

  /**
   * Function triggered on input change event.
   */
  onChange: PropTypes.func,

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

  /**
   * title of the checkbox.
   */
  title: PropTypes.string,
};

const defaultProps = {
  className: 'tm-check',
  inputType: 'checkbox',
  onChange: () => {},
  checked: false,
  tabIndex: 0,
  title: 'checkbox',
};

class Checkbox extends PureComponent {
  render() {
    const {
      className,
      onClick,
      onChange,
      tabIndex,
      inputType,
      checked,
      title,
    } = this.props;

    /*
      eslint-disable jsx-a11y/label-has-associated-control,
      jsx-a11y/label-has-for
    */
    return (
      <label
        className={`${className} tm-${inputType}`}
        tabIndex={tabIndex}
        title={title}
        aria-label={title}
        onKeyPress={e => {
          if (e.which === 13) {
            onClick(e);
          }
        }}
      >
        <input
          type={inputType}
          tabIndex={-1}
          checked={checked}
          onChange={e => onChange(e)}
          onClick={e => onClick(e)}
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
