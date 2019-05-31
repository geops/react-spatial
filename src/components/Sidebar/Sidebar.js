import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  position: PropTypes.oneOf(['left', 'right']),
  modal: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  onModalClick: PropTypes.func,
  removeEltOnClose: PropTypes.bool,
};

const defaultProps = {
  open: false,
  title: null,
  position: 'left',
  modal: true,
  className: 'tm-sidebar',
  children: null,
  onModalClick: null,
  removeEltOnClose: true,
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
  removeEltOnClose,
}) => {
  if (removeEltOnClose) {
    const [eltRemoved, setEltRemoved] = useState(!open);
    useEffect(() => {
      window.clearTimeout(timeout);

      if (open) {
        setEltRemoved(false);
      } else {
        timeout = window.setTimeout(() => {
          setEltRemoved(!open);
        }, 300);
      }
    });

    if (eltRemoved) {
      return null;
    }
  }

  const classModal = `${className}-modal`;
  const classToggle = open ? 'open' : 'close';
  const mainClassName = `${className} ${className}-${position} ${className}-${classToggle}`;

  const header = title ? <header>{title}</header> : null;

  const modalBg = modal ? (
    <Button
      className={`${classModal} ${classModal}-${classToggle}`}
      onClick={onModalClick}
    />
  ) : null;

  return (
    <>
      {modalBg}
      <div className={mainClassName}>
        {header}
        {children}
      </div>
    </>
  );
};

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
