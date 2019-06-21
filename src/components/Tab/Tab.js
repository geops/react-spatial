import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  /** Sets the Tab to active (adds active class)  */
  active: PropTypes.bool,
  /** CSS class of the Tab */
  className: PropTypes.string,
  /** Title of the Tab */
  title: PropTypes.string.isRequired,
  /** Function triggered on click event */
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {
  active: false,
  className: 'tm-tab',
};

const Tab = ({ onClick, active, className, title }) => {
  return (
    <li className={className + (active ? ' tm-active' : '')}>
      <Button title={title} onClick={e => onClick(e)}>
        {title}
      </Button>
    </li>
  );
};

Tab.propTypes = propTypes;
Tab.defaultProps = defaultProps;

export default Tab;
