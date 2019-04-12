import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayerService from '../../LayerService';

const propTypes = {
  layerService: PropTypes.instanceOf(LayerService).isRequired,
};

class Copyright extends Component {
  static getCopyrights(layers) {
    const copyrights = layers
      .filter(l => l.getVisible() && l.getCopyright())
      .map(l => l.getCopyright());

    const unique = Array.from(new Set(copyrights));

    return unique.join(' | ');
  }

  constructor(props) {
    super(props);
    this.state = {
      layers: [],
    };
  }

  componentDidMount() {
    const { layerService } = this.props;
    this.updateLayers();

    if (layerService) {
      this.updateLayerService();
    }
  }

  componentDidUpdate(prevProps) {
    const { layerService } = this.props;
    if (layerService !== prevProps.layerService) {
      this.updateLayerService();
    }
  }

  componentWillUnmount() {
    const { layerService } = this.props;
    layerService.unlistenChangeEvt('change:visible');
  }

  updateLayerService() {
    const { layerService } = this.props;
    layerService.on('change:visible', () => this.updateLayers());
  }

  updateLayers() {
    const { layerService } = this.props;

    if (layerService) {
      const layers = layerService.getLayersAsFlatArray();
      this.setState({ layers });
    }
  }

  render() {
    const { layers } = this.state;
    const copyrights = Copyright.getCopyrights(layers);

    return (
      <div className="tm-copyright">
        &copy;&nbsp;
        {copyrights}
      </div>
    );
  }
}

Copyright.propTypes = propTypes;
export default Copyright;
