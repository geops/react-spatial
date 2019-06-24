import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayerService from '../../LayerService';

const propTypes = {
  layerService: PropTypes.instanceOf(LayerService).isRequired,
};

class Copyright extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyrights: null,
    };
  }

  componentDidMount() {
    this.updateLayerService();
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
    layerService.on('change:visible', () => this.updateCopyright());
    this.updateCopyright();
  }

  updateCopyright() {
    const { layerService } = this.props;
    this.setState({
      copyrights: layerService.getCopyrights(),
    });
  }

  render() {
    const { copyrights } = this.state;
    if (!copyrights) {
      return null;
    }

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
