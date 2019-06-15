import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  /** Open or close the  */
  active: PropTypes.bool,
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {
  active: false,
  className: 'tm-tabs-item',
  tabIndex: 0,
};

const TabItem = ({ active, className, tabIndex, title, onClick }) => {
  return (
    <Button
      tabIndex={tabIndex}
      className={`${className}${active ? ' tm-active' : ''}`}
      title={title}
      onClick={e => onClick(e)}
    >
      {title}
    </Button>
  );
};

TabItem.propTypes = propTypes;
TabItem.defaultProps = defaultProps;

export default TabItem;
