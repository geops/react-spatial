import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /** CSS class of the container  */
  className: PropTypes.string,
  /** Children content of the Tabs container.  */
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  className: 'tm-tabs',
};

function Tabs({ children, className }) {
  return (
    <div className={className}>
      <ol className="tm-tabs-item-list">{children}</ol>
      <div className="tm-tabs-item-content">
        {children.map(child => {
          if (!child.props.active) return null;
          return child.props.children;
        })}
      </div>
    </div>
  );
}

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
