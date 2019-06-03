import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  /** Open or close the  */
  open: PropTypes.bool,
  title: PropTypes.string,
  position: PropTypes.oneOf(['left', 'right']),
  modal: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  onModalClick: PropTypes.func,
  collapseWidth: PropTypes.number,
};

const defaultProps = {
  open: false,
  title: null,
  position: 'left',
  modal: true,
  className: 'tm-sidebar',
  children: null,
  onModalClick: () => {},
  collapseWidth: 0,
};
let timeout;

const Sidebar = ({
  open,
  title,
  position,
  modal,
  className,
  children,
  onModalClick,
  collapseWidth,
}) => {
  const [shouldRemoveElt, setRemoveElt] = useState(!open);

  // We add the SideBar element before opening it.
  // We remove the SideBar element after closing it.
  useEffect(() => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(
      () => {
        setRemoveElt(!open);
      },
      open ? 5 : 300,
    );
  });

  const isClosed = !open && shouldRemoveElt;

  // If the sidebar is closed and collapseWidth is 0, we remove
  // completely the SideBar from the tree.
  if (isClosed && collapseWidth === 0) {
    return null;
  }

  const isClosing = open && !shouldRemoveElt;
  const classToggle = isClosing ? 'open' : 'close';
  const classMain = `${className} ${className}-${position} ${className}-${classToggle}`;
  const classModal = `${className}-modal ${className}-modal-${classToggle}`;
  const style = !open ? { width: collapseWidth } : undefined;
  const header = title ? <header>{title}</header> : null;

  // If the sidebar is closed, we remove the modal background.
  const modalBg =
    !modal || isClosed ? null : (
      <Button className={classModal} onClick={onModalClick} />
    );

  return (
    <>
      {modalBg}
      <div className={classMain} style={style}>
        {header}
        {children}
      </div>
    </>
  );
};

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
