import React from 'react';
import PropTypes from 'prop-types';


// const propTypes = {
//   title: PropTypes.string,
//   children: PropTypes.array.isRequired,
//   className: PropTypes.string,
//   closedClassName:  PropTypes.string,
//   classNameContent: PropTypes.string,
//   showIconOnly: PropTypes.bool
// };

// const defaultProps = {
//   className: 'tm-sidebar',
//   classNameContent: 'tm-sidebar-content'
// };

// const Sidebar = ({ children, className, classNameContent}) => (
//   <div className={className} showIconOnly>
//     <div className={classNameContent}>{children}</div>
//   </div>
// );

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

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
      let classes = ['tm-sidebar'];
      if (true) {
          classes = ['tm-sidebar','Open']
      }
  return (
      <nav className={classes.join(' ')}>
          <ul>
              <li><a href="/">Save map</a></li>
              <li><a href="/">Zoom</a></li>
          </ul>
      </nav>
  );
  }
};

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps; 
  

export default Sidebar; 


