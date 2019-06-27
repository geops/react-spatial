import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayerService from '../../LayerService';

const propTypes = {
  /**
   * Layer Service.
   */
  layerService: PropTypes.instanceOf(LayerService).isRequired,

  /**
   * Format function. Called with an array of copyrights from visible layers
   * and returns the copyright.
   */
  format: PropTypes.func,
};

const defaultProps = {
  format: copyrights => (
    <>
      &copy;
      {` ${copyrights.join(' | ')}`}
    </>
  ),
};

class Copyright extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyrights: [],
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

    const copyrights = layerService
      .getLayersAsFlatArray()
      .filter(l => l.getVisible() && l.getCopyright())
      .map(l => l.getCopyright());

    // remove duplicates
    const unique = Array.from(new Set(copyrights));

    this.setState({
      copyrights: unique,
    });
  }

  render() {
    const { format } = this.props;
    const { copyrights } = this.state;

    if (!copyrights.length) {
      return null;
    }

    return <div className="tm-copyright">{format(copyrights)}</div>;
  }
}

Copyright.propTypes = propTypes;
Copyright.defaultProps = defaultProps;
export default Copyright;
