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
  className: PropTypes.string.isRequired,

  /**
   * Title of the button.
   */
  title: PropTypes.string.isRequired,
};

/**
 * This component displays a simple button.
 */
class Button extends PureComponent {
  render() {
    const {
      onClick,
      children,
      className,
      title,
    } = this.props;

    return (
      <div
        className={`tm-button ${className}`}
        role="button"
        tabIndex="0"
        title={title}
        aria-label={title}
        onKeyPress={e => e.which === 13 && onClick()}
        onClick={() => onClick()}
      >
        {children}
      </div>
    );
  }
}

Button.propTypes = propTypes;

export default Button;
