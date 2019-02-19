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
   * Title of the button.
   */
  title: PropTypes.string,

  /**
   * Inline style.
   */
  style: PropTypes.object,
};

const defaultProps = {
  className: 'tm-button',
  title: undefined,
  style: undefined,
};

/**
 * This component displays a simple button.
 */
class Button extends PureComponent {
  render() {
    const { className, style, title, onClick, children } = this.props;

    return (
      <div
        role="button"
        tabIndex="0"
        className={className}
        title={title}
        style={style}
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
