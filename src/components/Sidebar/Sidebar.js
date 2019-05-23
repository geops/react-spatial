import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
  title: PropTypes.string,
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  closedClassName:  PropTypes.string,
  classNameContent: PropTypes.string,
  position: PropTypes.string,
  open: PropTypes.bool,
  collapsedWidth: PropTypes.number,
  modal: PropTypes.bool,
  showIconOnly: PropTypes.bool
};

const defaultProps = {
  className: 'tm-sidebar',
  classNameContent: 'tm-sidebar-content',
  collapsedWidth : '50px',
  position: 'left'
};

const Sidebar = ({ children, className, classNameContent }) => (
  <div className={className}>
    <div className={classNameContent}>{children}</div>
  </div>
);

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps; 
  

export default Sidebar; 


