import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayerTree from '../LayerTree/LayerTree';
import Checkbox from '../Checkbox/Checkbox';
import Button from '../Button/Button';

const propTypes = {
  /**
   *  List of topics
   */
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      visible: PropTypes.bool,
      expanded: PropTypes.bool,
      children: PropTypes.array,
    }),
  ).isRequired,

  /**
   * All props aimed to be passed to child LayerTree
   */
  propsToLayerTree: PropTypes.object.isRequired,

  /**
   * Function triggered on topic click.
   */
  onTopicClick: PropTypes.func,

  /**
   * Function triggered on topic toggle.
   */
  onTopicToggle: PropTypes.func,

  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * CSS class to apply on each item.
   */
  classNameItem: PropTypes.string,

  /**
   * CSS class to apply to the label element which contains the input.
   */
  classNameInput: PropTypes.string,

  /**
   * CSS class to apply to the toggle button which contains the title and the arrow.
   */
  classNameToggle: PropTypes.string,

  /**
   * CSS class to apply to the arrow.
   */
  classNameArrow: PropTypes.string,

  /**
   * Padding left.
   */
  padding: PropTypes.number,
};

const defaultProps = {
  className: 'tm-topic-list',
  classNameItem: 'tm-topic-list-item',
  classNameInput: undefined,
  classNameToggle: 'tm-topic-list-toggle',
  classNameArrow: 'tm-topic-list-arrow',
  onTopicClick: () => {},
  onTopicToggle: () => {},
  padding: 10,
};

class TopicList extends Component {
  renderInput(topic) {
    const { onTopicClick, classNameInput } = this.props;

    return (
      <Checkbox
        inputType="radio"
        checked={topic.visible}
        className={classNameInput}
        onClick={() => onTopicClick(topic)}
      />
    );
  }

  renderArrow(topic) {
    const { classNameArrow } = this.props;
    return (
      <div
        className={`${classNameArrow} ${classNameArrow}${
          topic.expanded ? '-expanded' : '-collapsed'
        }`}
      />
    );
  }

  // Render a button which expands/collapse the layer if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(topic) {
    const { onTopicToggle, onTopicClick, classNameToggle } = this.props;

    return (
      <Button
        tabIndex={-1}
        className={classNameToggle}
        onClick={() =>
          topic.visible ? onTopicToggle(topic) : onTopicClick(topic)
        }
      >
        <div>{topic.name}</div>
        {topic.visible ? this.renderArrow(topic) : null}
      </Button>
    );
  }

  renderTopic(topic, index) {
    const { classNameItem, padding, propsToLayerTree } = this.props;

    return (
      <div key={topic.id}>
        <div
          className={classNameItem}
          style={{
            paddingLeft: `${padding}px`,
          }}
        >
          {this.renderInput(topic)}
          {this.renderToggleButton(topic)}
        </div>
        <div style={{ paddingLeft: `${padding * 2}px` }}>
          {topic.visible && topic.expanded ? (
            <LayerTree key={index} {...propsToLayerTree} />
          ) : null}
        </div>
      </div>
    );
  }

  renderTree() {
    const { topics } = this.props;
    return <>{topics.map((t, i) => this.renderTopic(t, i))}</>;
  }

  render() {
    const { className, topics } = this.props;
    if (topics) {
      return <div className={className}>{this.renderTree()}</div>;
    }
    return null;
  }
}

TopicList.propTypes = propTypes;
TopicList.defaultProps = defaultProps;

export default TopicList;
