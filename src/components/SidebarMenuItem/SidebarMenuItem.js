import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  /**
   * Function triggered on click event.
   */
  onClick: PropTypes.func.isRequired,

  /**
   * Icon of the sidebar item.
   */
  icon: PropTypes.node.isRequired,

  /**
   * Show only the icon of the sidebar item.
   */
  showIconOnly: PropTypes.bool.isRequired,

  /**
   * CSS class of the sidebar item.
   */
  className: PropTypes.string,

  /**
   * HTML tabIndex attribute
   */
  tabIndex: PropTypes.number,

  /**
   * Title of the sidebar item.
   */
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  className: 'tm-sidebar-item',
  tabIndex: 0,
};

/**
 * This component displays an Item in the Sidebar.
 */
class SidebarMenuItem extends PureComponent {
  render() {
    const {
      onClick,
      icon,
      showIconOnly,
      className,
      title,
      tabIndex,
    } = this.props;

    return (
      <Button
        tabIndex={tabIndex}
        className={className}
        title={title}
        onClick={e => onClick(e)}
      >
        {showIconOnly ? (
          <div>{icon}</div>
        ) : (
          <div>
            {icon}
            <span>{title}</span>
          </div>
        )}
      </Button>
    );
  }
}

SidebarMenuItem.propTypes = propTypes;
SidebarMenuItem.defaultProps = defaultProps;

export default SidebarMenuItem;
