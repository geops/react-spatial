import { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import OLMap from 'ol/Map';
import LayerService from '../../LayerService';

const propTypes = {
  /**
   * Either 'react-router' history object:
   * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/history.md<br>
   * or default fallback as HTML5 History:
   * https://developer.mozilla.org/en-US/docs/Web/API/History
   */
  history: PropTypes.shape({
    replace: PropTypes.func,
  }),

  /**
   * Layers provider.
   */
  layerService: PropTypes.instanceOf(LayerService),

  /**
   * An ol map.
   */
  map: PropTypes.instanceOf(OLMap),

  /**
   * Params to be written in url.
   */
  params: PropTypes.object,
};

const defaultProps = {
  history: null,
  layerService: null,
  map: null,
  params: {},
};

/**
 * This component handles permalink logic.
 */
class Permalink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapParams: null,
      layersParams: null,
    };
  }

  componentDidMount() {
    const { map, layerService } = this.props;
    if (map) {
      map.on('moveend', () => this.onMapMoved());
    }

    if (layerService) {
      this.updateLayerService();
    }
  }

  componentDidUpdate(prevProps) {
    const { layerService } = this.props;

    if (layerService !== prevProps.layerService) {
      this.updateLayerService();
    }
    this.updateHistory();
  }

  onMapMoved() {
    const { map } = this.props;
    const mapView = map.getView();
    const { center } = mapView.getProperties();

    this.setState({
      mapParams: {
        x: center[0],
        y: center[1],
        z: mapView.getZoom(),
      },
    });
  }

  updateLayerService() {
    const { layerService } = this.props;
    if (layerService) {
      this.updateLayers(layerService);
      layerService.on('change:visible', () => this.updateLayers(layerService));
    }
  }

  updateLayers(layerService) {
    this.setState({
      layersParams: {
        layers: layerService
          .getLayers()
          .filter(l => l.isBaseLayer !== true)
          .filter(l => l.getVisibleChildren().length || l.getVisible())
          .map(l => {
            if (l.getVisibleChildren().length) {
              return l.getVisibleChildren();
            }
            if (l.getVisible()) {
              return l;
            }
            return null;
          })
          .reduce((pre, cur) => pre.concat(cur), [])
          .map(l => l.id)
          .join(','),
      },
    });
  }

  updateHistory() {
    const { params, history } = this.props;
    const { mapParams, layersParams } = this.state;

    const qsStr = qs.stringify(
      {
        ...params,
        ...layersParams,
        ...mapParams,
      },
      { encode: false },
    );

    const locSearch = `?${qsStr}`;

    if (
      (!qsStr && window.location.search) ||
      (qsStr && locSearch !== window.location.search)
    ) {
      if (history) {
        history.replace({
          search: locSearch === '?' ? '' : locSearch,
        });
      } else {
        const { hash } = window.location;
        window.history.replaceState(
          undefined,
          undefined,
          `${locSearch === '?' ? '' : locSearch}${hash || ''}`,
        );
      }
    }
  }

  render() {
    return null;
  }
}

Permalink.propTypes = propTypes;
Permalink.defaultProps = defaultProps;

export default Permalink;
