import React, { Component } from 'react';
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

class Tabs extends Component {
  constructor(props) {
    super(props);
    const { children } = this.props;
    this.state = {
      activeTab: children[0].props.title,
    };
    console.log(this.state);
  }

  render() {
    const {
      props: { children, className },
      state: { activeTab },
    } = this;

    return (
      <div className={className}>
        <ol className="tm-tabs-item-list">
          {children.map(child => {
            const { tabIndex, title, i } = child.props;
            console.log(child.props);
            return (
              <TabItem
                tabIndex={tabIndex}
                key={i}
                activeTab={activeTab}
                title={title}
                onClick={() => {
                  this.setState({ activeTab: child.props.title });
                }}
              />
            );
          })}
        </ol>
        <div className="tm-tabs-item-content">
          {children.map(child => {
            if (child.props.title !== activeTab) return undefined;
            return child.props.children;
          })}
        </div>
      </div>
    );
  }
}

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
