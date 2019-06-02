import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';

const propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  classNameUl: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  show: PropTypes.bool,
};

const defaultProps = {
  className: 'tm-sidebar',
  classNameUl: 'toolbar_navigation-items ul',
};

// eslint-disable-next-line react/prefer-stateless-function
class Sidebar extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };

    this.toggleMenuBar = this.toggleMenuBar.bind(this);
  }

  toggleMenuBar() {
    this.setState(prevState => {
      return {
        show: !prevState.show,
      };
    });
  }


  render() {
    const { className, children, classNameUl } = this.props;
    let classes = className;
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.show && this.state.show) {
      classes = className + ' Open';
    }

    let toggleButton = (
      <div>
        <button className="toggle-button" onClick={()=>this.toggleMenuBar()}>
          <div className="toggle-button__line" />
          <div className="toggle-button__line" />
          <div className="toggle-button__line" />
        </button>
        </div>
    )


    return (
      <>
        <Header className="headerClass">
          <div className="header__navigation">
        {toggleButton}
        <div className='spacer'></div>
        <div className="header_navigation__items">
          <ul>
            <li>{children}</li>
          </ul>
        </div>
        </div>
          </Header>
        <nav className={classes}>

          <div className="toolbar_navigation-items">
            <ul className={classNameUl}>{children}</ul>
          </div>
        </nav>
      </>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
