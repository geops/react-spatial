import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Href attribute.
   */
  href: PropTypes.string,
  /**
   * Children content of the link.
   */
  children: PropTypes.node.isRequired,
  /**
   * Title attribute.
   */
  title: PropTypes.string,
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
  className: undefined,
  href: '#',
  title: undefined,
};

/**
 * This component displays a simple a HTML element with an onclick attribute.
 */
class ActionLink extends PureComponent {
  render() {
    const { href, children, title, className, onClick } = this.props;

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
        {children}
      </a>
    );
  }
}

ActionLink.propTypes = propTypes;
ActionLink.defaultProps = defaultProps;

export default ActionLink;
