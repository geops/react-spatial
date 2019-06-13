import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  /** Open or close the  */
  active: PropTypes.bool,
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  active: false,
  className: 'tm-tabs-item',
  tabIndex: 0,
};

const TabItem = ({ active, className, tabIndex, title }) => {
  return (
    <Button
      tabIndex={tabIndex}
      className={className}
      title={title}
      active={active}
      onClick={() => alert(tabIndex)}
    >
      {title}
    </Button>
  );
};

TabItem.propTypes = propTypes;
TabItem.defaultProps = defaultProps;

export default TabItem;
