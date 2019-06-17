import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  /** Open or close the  */
  active: PropTypes.bool,
  className: PropTypes.string,
  classNameButton: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {
  active: false,
  className: 'tm-tabs-item',
  classNameButton: 'tm-tabs-item-button',
};

const TabItem = ({ onClick, active, className, classNameButton, title }) => {
  return (
    <li className={className}>
      <Button
        className={`${classNameButton}${active ? ' tm-active' : ''}`}
        title={title}
        onClick={e => onClick(e)}
      >
        {title}
      </Button>
    </li>
  );
};

TabItem.propTypes = propTypes;
TabItem.defaultProps = defaultProps;

export default TabItem;
