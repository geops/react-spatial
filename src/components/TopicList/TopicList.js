import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConfigReader from '../../ConfigReader';
import LayerTree from '../LayerTree';

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
   * Padding left.
   */
  padding: PropTypes.number,
};

const defaultProps = {
  propsToLayerTree: null,
  className: 'rs-topic-list',
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
    const { onTopicClick } = this.props;
    const onClick = () => {
      this.setState({ expandedTopic: topic.id });
      onTopicClick(topic);
    };

    return (
      // eslint-disable-next-line jsx-a11y/label-has-associated-control
      <label
        aria-label="checkbox"
        className="rs-check rs-radio"
        tabIndex={-1}
        onKeyPress={e => {
          if (e.which === 13) {
            onClick();
          }
        }}
        title="checkbox"
      >
        <input
          type="radio"
          tabIndex={-1}
          checked={topic.visible}
          onChange={onClick}
          onClick={onClick}
        />
        <span />
      </label>
    );
  }

  renderArrow(topic) {
    const { expandedTopic } = this.state;
    return (
      <div
        className={`rs--topic-list-arrow rs-topic-list-arrow-${
          topic.id === expandedTopic ? 'expanded' : 'collapsed'
        }`}
      />
    );
  }

  renderBarrierFreeDiv(topic) {
    const { onTopicClick } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
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
    const { onTopicClick } = this.props;
    const onClick = () => {
      if (topic.visible) {
        this.onTopicToggle(topic);
      } else {
        this.setState({ expandedTopic: topic.id });
        onTopicClick(topic);
      }
    };

    return (
      <div
        role="button"
        tabIndex={-1}
        className="rs-topic-list-toggle"
        onClick={onClick}
        onKeyPress={onClick}
      >
        <div>{topic.name}</div>
        {topic.visible ? this.renderArrow(topic) : null}
      </div>
    );
  }

  renderTopic(topic, index) {
    const { padding, propsToLayerTree } = this.props;
    const { expandedTopic } = this.state;

    return (
      <div key={topic.id}>
        <div className="rs-topic-list-item">
          {this.renderBarrierFreeDiv(topic)}
          {this.renderInput(topic)}
          {this.renderToggleButton(topic)}
        </div>
        <div style={{ paddingLeft: `${padding}px` }}>
          {topic.visible && topic.id === expandedTopic ? (
            // eslint-disable-next-line react/jsx-props-no-spreading
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
