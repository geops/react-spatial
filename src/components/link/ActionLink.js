import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Href attribute.
   */
  href: PropTypes.string,
  /**
   * Text displayed.
   */
  label: PropTypes.string.isRequired,
  /**
   * Title attribute.
   */
  title: PropTypes.string.isRequired,
  /**
   * CSS class.
   */
  className: PropTypes.string,
  /**
   * Function trigger on click event.
   */
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {
  className: null,
  href: '#',
};

/**
 * This component displays a simple a HTML element with an onclick attribute.
 */
class ActionLink extends PureComponent {
  render() {
    const { href, label, title, className, onClick } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a
        href={href}
        title={title}
        aria-label={title}
        className={className}
        onClick={evt => {
          evt.preventDefault();
          evt.stopPropagation();
          onClick(evt);
        }}
      >
        {label}
      </a>
    );
  }
}

ActionLink.propTypes = propTypes;
ActionLink.defaultProps = defaultProps;

export default ActionLink;
