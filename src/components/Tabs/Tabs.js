import React from 'react';
import PropTypes from 'prop-types';
import TabItem from '../TabItem';

const propTypes = {
  /** Open or close the  */
  className: PropTypes.string,
  children: PropTypes.node,
};

const defaultProps = {
  className: 'tm-tabs',
  children: null,
};

const Tabs = props => {
  const { children, className } = props;

  console.log(children);
  // const activate = index => {
  //   console.log(index);
  // };

  return (
    <div className={className}>
      <ol className="tm-tabs-item-list">
        {children.map(child => {
          const { title, tabIndex, onClick } = child.props;
          let { active } = child.props.active;
          return <TabItem title={title} onClick={() => (console.log(active))} />;
      })}
      </ol>
      <div className="tm-tabs-item-content">
        {children.map(child => {
          return child.props.children;
        })}
      </div>
    </div>
  );
};

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
