import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayerService from 'react-spatial/LayerService';

const propTypes = {
  layerService: PropTypes.instanceOf(LayerService).isRequired,
};

class Copyright extends Component {
  constructor(props) {
    super(props);
    const { layerService } = this.props;
    this.layerService = layerService;

    this.state = {
      layers: [],
    };
  }

  componentDidMount() {
    this.updateLayers();
  }

  componentDidUpdate(prevProps) {
    const { layerService } = this.props;
    if (layerService !== prevProps.layerService) {
      this.layerService.on('change:visible', () => this.updateLayers());
    }
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
    const copyrights = layers.map(l =>
      l.getVisible() ? l.getCopyright() : null,
    );

    return <div className="tm-copyright">ⓒ  {copyrights.join(' | ')}</div>;
  }
}

Copyright.propTypes = propTypes;
export default Copyright;
