import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

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
   * CSS Class of the button.
   */
  className: PropTypes.string,

  /**
   * Title of the button.
   */
  title: PropTypes.string,
};

const defaultProps = {
  className: undefined,
  title: undefined,
};

/**
 * This component displays a simple button.
 */
class Button extends PureComponent {
  render() {
    const { onClick, children, className, title, tabIndex, style } = this.props;

    return (
      <div
        className={`tm-button ${className}`}
        role="button"
        style={style}
        tabIndex={tabIndex}
        title={title}
        aria-label={title}
        onKeyPress={e => e.which === 13 && onClick()}
        onClick={e => onClick(e)}
      >
        {children}
      </div>
    );
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
