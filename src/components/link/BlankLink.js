import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Link to open in a new window.
   */
  href: PropTypes.string.isRequired,
  /**
   * Elt to display: a text or an image.
   */
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  /**
   * Title attribute.
   */
  title: PropTypes.string.isRequired,
  /**
   * CSS class.
   */
  className: PropTypes.string,
};

const defaultProps = {
  className: null,
};

/**
 * This component displays a simple a HTML element which opens the link provided
 * in a blank window.
 */
class BlankLink extends PureComponent {
  render() {
    const {
      href, label, title, className,
    } = this.props;
    return (
      <a
        href={href}
        title={title}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex="0"
      >
        {label}
      </a>
    );
  }
}

BlankLink.propTypes = propTypes;
BlankLink.defaultProps = defaultProps;

export default BlankLink;
