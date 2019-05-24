import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
  title: PropTypes.string,
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  closedClassName:  PropTypes.string,
  classNameContent: PropTypes.string,
  showIconOnly: PropTypes.bool
};

const defaultProps = {
  className: 'tm-sidebar',
  classNameContent: 'tm-sidebar-content'
};

const Sidebar = ({ children, className, classNameContent}) => (
  <div className={className} showIconOnly>
    <div className={classNameContent}>{children}</div>
  </div>
);

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps; 
  

export default Sidebar; 


