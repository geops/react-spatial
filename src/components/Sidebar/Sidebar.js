import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';

const propTypes = {
  /**
   * Especially for SidebarItem component.
   */
  children: PropTypes.array.isRequired,
  /**
   * CSS class for Sidebar container.
   */
  classNameSideMenu: PropTypes.string,
  /**
   * CSS class for Header toggle button and  nav items.
   */
  classNameSpacer: PropTypes.string,
  /**
   * CSS class for SidebarItem ul.
   */
  classNameUl: PropTypes.string,
  /**
   * CSS class for Header.
   */
  classNameHeader: PropTypes.string,
  /**
   * CSS class for Header navItems container.
   */
  classNameHeaderNav: PropTypes.string,
  /**
   * CSS class for Header navItems.
   */
  classNameHeaderNavItems: PropTypes.string,
  /**
   * CSS class for Sidebar toggle button.
   */
  classNameToggleButton: PropTypes.string,
  /**
   * CSS class for Sidebar toggle button line.
   */
  classNameToggleButtonLine: PropTypes.string,
  /**
   * Boolean for Sidebar container show/hide.
   */
  show: PropTypes.bool.isRequired,
};

const defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  classNameSideMenu: 'tm-sidebar',
  classNameSpacer: 'spacer',
  classNameUl: 'toolbar-navigation-items ul',
  classNameHeader: 'headerClass',
  classNameHeaderNav: 'header-navigation',
  classNameHeaderNavItems: 'header-navigation-items',
  classNameToggleButton: 'toggle-button',
  classNameToggleButtonLine: 'toggle-button-line',
};

// eslint-disable-next-line react/prefer-stateless-function
class Sidebar extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/destructuring-assignment
      show: this.props.show,
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
    const {
      children,
      classNameUl,
      classNameHeader,
      classNameHeaderNav,
      classNameHeaderNavItems,
      classNameSideMenu,
      classNameSpacer,
      classNameToggleButton,
      classNameToggleButtonLine,
    } = this.props;

    let classes = classNameSideMenu;
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.show) {
      classes = `${classNameSideMenu} Open`;
    }

    const toggleButton = (
      <div>
        <button
          type="button"
          className={classNameToggleButton}
          onClick={() => this.toggleMenuBar()}
        >
          <div className={classNameToggleButtonLine} />
          <div className={classNameToggleButtonLine} />
          <div className={classNameToggleButtonLine} />
        </button>
      </div>
    );

    return (
      <>
        <Header className={classNameHeader}>
          <div className={classNameHeaderNav}>
            {toggleButton}
            <div className={classNameSpacer} />
            <div className={classNameHeaderNavItems}>
              <ul>
                <li>{children}</li>
              </ul>
            </div>
          </div>
          </Header>
        <nav className={classes}>
          <ul className={classNameUl}>{children}</ul>
        </nav>
      </>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
