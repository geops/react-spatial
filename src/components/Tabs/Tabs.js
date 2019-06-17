import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /** Open or close the  */
  className: PropTypes.string,
  children: PropTypes.node,
};

const defaultProps = {
  className: 'tm-tabs',
  children: null,
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
