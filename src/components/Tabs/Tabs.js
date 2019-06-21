import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /** CSS class of the container  */
  className: PropTypes.string,

  /** CSS class of the list of tabs  */
  classNameList: PropTypes.string,

  /** CSS class of the content  */
  classNameContent: PropTypes.string,

  /** Children content of the Tabs container.  */
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  className: 'tm-tabs',
  classNameList: 'tm-tabs-list',
  classNameContent: 'tm-tabs-content',
};

function Tabs({ children, className, classNameList, classNameContent }) {
  return (
    <div className={className}>
      <ol className={classNameList}>{children}</ol>
      <div className={classNameContent}>
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
