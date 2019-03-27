import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayerService from '../../LayerService';

const propTypes = {
  layerService: PropTypes.instanceOf(LayerService).isRequired,
};

class Copyright extends Component {
  constructor(props) {
    super(props);
    const { layerService } = this.props;

    this.state = {
      layers: [],
    };

    if (layerService) {
      layerService.on('change:visible', () => this.updateLayers());
    }
  }

  componentDidMount() {
    this.updateLayers();
  }

  componentDidUpdate(prevProps) {
    const { layerService } = this.props;
    if (layerService !== prevProps.layerService) {
      layerService.on('change:visible', () => this.updateLayers());
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
    const cLayers = layers.filter(l => l.getVisible() && l.getCopyright());
    const copyrights = cLayers.map(l => l.getCopyright());

    if (!copyrights.length) {
      return null;
    }

    return (
      <div className="tm-copyright">
        &copy;&nbsp;
        {copyrights.join(' | ')}
      </div>
    );
  }
}

Copyright.propTypes = propTypes;
export default Copyright;
