import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  /** Open or close the  */
  active: PropTypes.bool,
  tabIndex: PropTypes.number,
  className: PropTypes.string,
  classNameContent: PropTypes.string,
  classNameButton: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};

const defaultProps = {
  active: false,
  tabIndex: null,
  className: 'tm-tabs-item',
  classNameButton: 'tm-tabs-item-button',
  classNameContent: 'tm-tabs-item-content',
  children: null,
};

const TabItem = ({
  active,
  tabIndex,
  className,
  classNameButton,
  classNameContent,
  title,
  onClick,
  children,
}) => {
  const activate = () => {
    onClick(tabIndex);
  };
  return (
    <li className={className} tabIndex={tabIndex}>
      <Button
        className={`${classNameButton}${active ? ' tm-active' : ''}`}
        title={title}
        onClick={activate}
      >
        {title}
      </Button>
    </li>
  );
};

TabItem.propTypes = propTypes;
TabItem.defaultProps = defaultProps;

export default TabItem;
