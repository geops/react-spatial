import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConfigReader from '../../ConfigReader';
import LayerTree from '../LayerTree';
import Checkbox from '../Checkbox';
import Button from '../Button';

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
  propsToLayerTree: PropTypes.object,

  /**
   * Function triggered on topic click.
   */
  onTopicClick: PropTypes.func,

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
  propsToLayerTree: null,
  className: 'tm-topic-list',
  classNameItem: 'tm-topic-list-item',
  classNameInput: undefined,
  classNameToggle: 'tm-topic-list-toggle',
  classNameArrow: 'tm-topic-list-arrow',
  onTopicClick: () => {},
  padding: 30,
};

class TopicList extends Component {
  constructor(props) {
    super(props);
    const { topics } = this.props;

    this.state = {
      expandedTopic: ConfigReader.getVisibleTopic(topics).id,
    };
  }

  onTopicToggle(topic) {
    const { expandedTopic } = this.state;
    this.setState({ expandedTopic: expandedTopic ? null : topic.id });
  }

  renderInput(topic) {
    const { onTopicClick, classNameInput } = this.props;

    return (
      <Checkbox
        inputType="radio"
        tabIndex={-1}
        checked={topic.visible}
        className={classNameInput}
        onClick={() => {
          this.setState({ expandedTopic: topic.id });
          onTopicClick(topic);
        }}
      />
    );
  }

  renderArrow(topic) {
    const { classNameArrow } = this.props;
    const { expandedTopic } = this.state;
    return (
      <div
        className={`${classNameArrow} ${classNameArrow}${
          topic.id === expandedTopic ? '-expanded' : '-collapsed'
        }`}
      />
    );
  }

  renderBarrierFreeDiv(topic) {
    const { onTopicClick } = this.props;

    return (
      <div
        style={{
          position: 'absolute',
          margin: 'auto',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        role="button"
        tabIndex={0}
        onKeyPress={e => {
          if (e.which === 13) {
            if (topic.visible) {
              this.onTopicToggle(topic);
            } else {
              this.setState({ expandedTopic: topic.id });
              onTopicClick(topic);
            }
          }
        }}
      />
    );
  }

  // Render a button which expands/collapse the layer if there is children
  // or simulate a click on the input otherwise.
  renderToggleButton(topic) {
    const { onTopicClick, classNameToggle } = this.props;

    return (
      <Button
        tabIndex={-1}
        className={classNameToggle}
        onClick={() => {
          if (topic.visible) {
            this.onTopicToggle(topic);
          } else {
            this.setState({ expandedTopic: topic.id });
            onTopicClick(topic);
          }
        }}
      >
        <div>{topic.name}</div>
        {topic.visible ? this.renderArrow(topic) : null}
      </Button>
    );
  }

  renderTopic(topic, index) {
    const { classNameItem, padding, propsToLayerTree } = this.props;
    const { expandedTopic } = this.state;

    return (
      <div key={topic.id}>
        <div className={classNameItem}>
          {this.renderBarrierFreeDiv(topic)}
          {this.renderInput(topic)}
          {this.renderToggleButton(topic)}
        </div>
        <div style={{ paddingLeft: `${padding}px` }}>
          {topic.visible && topic.id === expandedTopic ? (
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
