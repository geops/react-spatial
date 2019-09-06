import { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import OLMap from 'ol/Map';
import { unByKey } from 'ol/Observable';
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

  /**
   * Maximum number of decimals allowed for coordinates.
   */
  coordinateDecimals: PropTypes.number,
};

const defaultProps = {
  history: null,
  layerService: null,
  map: null,
  params: {},
  coordinateDecimals: 2,
};

/**
 * This component handles permalink logic.
 */
class Permalink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: undefined,
      y: undefined,
      z: undefined,
      layers: undefined,
      baseLayers: undefined,
    };
    this.moveEndRef = null;
  }

  componentDidMount() {
    const { map, layerService } = this.props;
    if (map) {
      this.moveEndRef = map.on('moveend', () => {
        this.onMapMoved();
      });
    }

    if (layerService) {
      this.updateLayerService();

      // set layer visibility based on 'layers' parameter.
      const urlParams = qs.parse(window.location.search);
      const visibleLayers = (urlParams.layers || '').split(',');
      layerService.getLayersAsFlatArray().forEach(l => {
        if (visibleLayers.includes(l.getKey())) {
          l.setVisible(true);
        }
      });

      // Set baser layer visibility based on 'baseLayers' parameter.
      const visibleBaseLayers = (urlParams.baseLayers || '').split(',');
      layerService.getBaseLayers().forEach(baseLayer => {
        if (baseLayer.getKey() === visibleBaseLayers[0]) {
          baseLayer.setVisible(true); // The radio group will hide the others baseLayers automatically
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { map, layerService } = this.props;

    if (layerService !== prevProps.layerService) {
      this.updateLayerService();
    }

    if (map !== prevProps.map) {
      this.moveEndRef = map.on('moveend', () => this.onMapMoved());
    }

    this.updateHistory();
  }

  componentWillUnmount() {
    const { layerService, map } = this.props;

    if (map) {
      unByKey(this.moveEndRef);
    }

    if (layerService) {
      layerService.unlistenChangeEvt('change:visible');
    }
  }

  onMapMoved() {
    const { map } = this.props;
    const mapView = map.getView();
    const { center } = mapView.getProperties();

    this.setState({
      x: this.roundCoord(center[0]),
      y: this.roundCoord(center[1]),
      z: mapView.getZoom(),
    });
  }

  roundCoord(val) {
    const { coordinateDecimals } = this.props;
    return parseFloat(val.toFixed(coordinateDecimals));
  }

  updateLayerService() {
    const { layerService } = this.props;
    if (layerService) {
      this.updateLayers(layerService);
      layerService.on('change:visible', () => this.updateLayers(layerService));
    }
  }

  updateLayers(layerService) {
    const baseLayers = layerService.getBaseLayers();
    const idx = baseLayers.findIndex(l => l.getVisible());
    if (idx !== -1) {
      const baseLayerVisible = baseLayers.splice(idx, 1);
      baseLayers.unshift(baseLayerVisible[0]);
    }

    this.setState({
      layers: layerService
        .getLayersAsFlatArray()
        .filter(
          l => !l.getIsBaseLayer() && l.getVisible() && !l.hasVisibleChildren(),
        )
        .map(l => l.getKey())
        .join(),
      baseLayers:
        baseLayers.length > 1
          ? baseLayers.map(l => l.getKey()).join()
          : undefined,
    });
  }

  updateHistory() {
    const { params, history } = this.props;

    const parameters = {
      ...params,
      ...this.state,
    };

    Object.keys(parameters).forEach(key => {
      if (parameters[key] === undefined) {
        delete parameters[key];
      }
    });

    const qsStr = qs.stringify(
      {
        ...params,
        ...parameters,
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
