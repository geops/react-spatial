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

const Tabs = props => {
  const { children, className } = props;
  return (
    <>
      <div className={className}>{children}</div>
    </>
  );
};

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
