import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import { SSL_OP_NO_TLSv1_1 } from 'constants';
import LayerTree from '../LayerTree';
import Button from '../Button';
import Footer from '../Footer';

const propTypes = {
  /**
   * Layers provider.
   */
  layerService: PropTypes.object,

  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * CSS class to apply on each item.
   */
  classNameItem: PropTypes.string,

  /**
   * CSS class to apply to the button to move the previous base layer.
   */
  classNamePrevious: PropTypes.string,

  /**
   * CSS class to apply to the button to move the the next base layer.
   */
  classNameNext: PropTypes.string,
};

const defaultProps = {
  layerService: undefined,
  className: 'tm-base-layer-toggler',
  classNameItem: 'tm-base-layer-item',
  classNamePrevious: 'tm-base-layer-previous',
  classNameNext: 'tm-base-layer-next',
};

class BaseLayerToggler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: null,
      layerVisible: null,
      idx: null,
    };
  }

  componentDidMount() {
    const { layerService } = this.props;

    if (layerService) {
      this.onUpdateLayerService();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { layerService } = this.props;
    const { layerVisible } = this.state;

    if (layerService !== prevProps.layerService) {
      this.onUpdateLayerService();
    }

    if (layerVisible !== prevState.layerVisible) {
      this.next();
    }
  }

  onUpdateLayerService() {
    const { layerService } = this.props;

    if (!layerService) {
      return;
    }

    this.updateState();
    layerService.on('change:visible', () => this.updateState());
  }

  updateState() {
    const { layerService } = this.props;
    const layers = layerService.getRadioGroupLayers('baseLayer');
    const idx = layers.findIndex(l => l.getVisible());
    this.setState({
      layers,
      idx,
      layerVisible: layers[idx],
    });
  }

  previous() {
    const { layers, layerVisible, idx } = this.state;
    let previousIdx = idx - 1;

    while (!layers[previousIdx] || layerVisible === layers[previousIdx]) {
      previousIdx -= 1;
      if (previousIdx < 0) {
        previousIdx = layers.length - 1;
      }
    }

    this.setState({
      idx: previousIdx,
    });
  }

  next() {
    const { layers, layerVisible, idx } = this.state;
    let nextIdx = idx + 1;

    while (!layers[nextIdx] || layerVisible === layers[nextIdx]) {
      nextIdx += 1;
      if (nextIdx >= layers.length) {
        nextIdx = 0;
      }
    }

    this.setState({
      idx: nextIdx,
    });
  }

  renderItem(item, onClick) {
    const { classNameItem } = this.props;
    const { layers, idx } = this.state;
    return (
      <Button
        key={item.getName()}
        className={classNameItem}
        style={{
          zIndex: item === layers[idx] ? 0 : -1,
        }}
        onClick={() => {
          onClick(item);
        }}
      >
        {item.getName()}
      </Button>
    );
  }

  render() {
    const {
      className,
      classNamePrevious,
      classNameNext,
      layerService,
    } = this.props;
    const { layers } = this.state;

    if (!layers || layers.length < 2) {
      return null;
    }

    return (
      <div className={className}>
        <LayerTree
          layerService={layerService}
          isItemHidden={l => {
            return !l.getIsBaseLayer();
          }}
          renderItem={(item, dfltOnClick) => this.renderItem(item, dfltOnClick)}
        />
        <Footer>
          <Button className={classNamePrevious} onClick={() => this.previous()}>
            <FaArrowCircleLeft />
          </Button>
          <Button className={classNameNext} onClick={() => this.next()}>
            <FaArrowCircleRight />
          </Button>
        </Footer>
      </div>
    );
  }
}

BaseLayerToggler.propTypes = propTypes;
BaseLayerToggler.defaultProps = defaultProps;

export default BaseLayerToggler;
