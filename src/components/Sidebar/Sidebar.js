import React from 'react';
import PropTypes from 'prop-types';
import List from '../List';

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
  closedClassName: PropTypes.string,
  classNameUl: PropTypes.string,
  classNameContent: PropTypes.string,
  showIconOnly: PropTypes.bool
};

const defaultProps = {
  className: 'tm-sidebar',
  classNameContent: 'tm-sidebar-content',
  classNameUl: 'toolbar_navigation-items ul'
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    const { children, classNameUl } = this.props;
    let classes = ['tm-sidebar'];
    if (this.props.show) {
      classes = ['tm-sidebar', 'Open']
    }
    return (
      <nav className={classes.join(' ')}>
        <div className="toolbar_navigation-items">
          <ul className={classNameUl}>
            {children}
          </ul>
        </div>
      </nav>
    );
  }
};

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;


export default Sidebar;


