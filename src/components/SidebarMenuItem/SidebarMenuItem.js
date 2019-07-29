import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  /**
   * Add an active class to the item.
   */
  active: PropTypes.bool,

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
  showIconOnly: PropTypes.bool,

  /**
   * CSS class of the sidebar item.
   */
  className: PropTypes.string,

  /**
   * HTML tabIndex attribute
   */
  tabIndex: PropTypes.number,

  /**
   * Keyboard accesskey shortcut.
   */
  accessKey: PropTypes.string,

  /**
   * Content of the sidebar item, overwrites title.
   */
  body: PropTypes.element,

  /**
   * Title of the sidebar item.
   */
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  active: false,
  showIconOnly: false,
  className: 'tm-sidebar-item',
  tabIndex: 0,
  accessKey: undefined,
  body: undefined,
};

/**
 * This component displays an Item in the Sidebar.
 */
function SidebarMenuItem({
  active,
  onClick,
  icon,
  showIconOnly,
  className,
  title,
  tabIndex,
  accessKey,
  body,
}) {
  return (
    <Button
      tabIndex={tabIndex}
      className={`${className}${active ? ' tm-active' : ''}`}
      title={title}
      onClick={e => onClick(e)}
      accessKey={accessKey}
    >
      <div>{icon}</div>
      {showIconOnly ? null : <span>{body || title}</span>}
    </Button>
  );
}

SidebarMenuItem.propTypes = propTypes;
SidebarMenuItem.defaultProps = defaultProps;

export default SidebarMenuItem;
