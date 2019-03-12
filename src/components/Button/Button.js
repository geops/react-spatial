import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Function triggered on button's click event.
   */
  onClick: PropTypes.func.isRequired,

  /**
   * Children content of the button.
   */
  children: PropTypes.node.isRequired,

  /**
   * CSS class of the button.
   */
  className: PropTypes.string,

  /**
   * HTML tabIndex attribute
   */
  tabIndex: PropTypes.number,

  /**
   * Title of the button.
   */
  title: PropTypes.string,

  /**
   * HTML style attribute
   */
  style: PropTypes.object,
};

const defaultProps = {
  className: 'tm-button',
  title: undefined,
  tabIndex: undefined,
  style: undefined,
};

/**
 * This component displays a simple button.
 */
class Button extends PureComponent {
  render() {
    const { onClick, children, className, title, tabIndex, style } = this.props;

    return (
      <div
        role="button"
        style={style}
        tabIndex={tabIndex}
        className={className}
        title={title}
        aria-label={title}
        onClick={e => onClick(e)}
        onKeyPress={e => e.which === 13 && onClick(e)}
      >
        {children}
      </div>
    );
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
