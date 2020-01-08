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

  /**
   * Determine if the layer is hidden in the permalink or not.
   *
   * @param {object} item The item to hide or not.
   *
   * @return {bool} true if the item is not displayed in the permalink
   */
  isLayerHidden: PropTypes.func,
};

const defaultProps = {
  history: null,
  layerService: null,
  map: null,
  params: {},
  coordinateDecimals: 2,
  isLayerHidden: () => false,
};

/**
 * This component handles permalink logic.
 */
class Permalink extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.moveEndRef = null;
    this.updateLayers = this.updateLayers.bind(this);
  }

  componentDidMount() {
    const { map, layerService, isLayerHidden } = this.props;
    if (map) {
      this.moveEndRef = map.on('moveend', () => {
        this.onMapMoved();
      });
    }

    if (layerService) {
      this.updateLayerService();

      // set layer visibility based on 'layers' parameter.
      const urlParams = qs.parse(window.location.search);

      if (urlParams.layers) {
        const visibleLayers = urlParams.layers.split(',');
        layerService.getLayersAsFlatArray().forEach(l => {
          if (visibleLayers.includes(l.getKey())) {
            l.setVisible(true);
          } else if (
            !l.getIsBaseLayer() &&
            !l.hasVisibleChildren() &&
            !isLayerHidden(l)
          ) {
            l.setVisible(false);
          }
        });
      }

      // Set baser layer visibility based on 'baseLayers' parameter.
      const visibleBaseLayers = (urlParams.baselayers || '').split(',');
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
      layerService.un('change:layers', this.updateLayers);
      layerService.un('change:visible', this.updateLayers);
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
      this.updateLayers();
      layerService.on('change:layers', this.updateLayers);
      layerService.on('change:visible', this.updateLayers);
    }
  }

  updateLayers() {
    const { layerService, isLayerHidden } = this.props;
    const baseLayers = layerService.getBaseLayers();
    const idx = baseLayers.findIndex(l => l.getVisible());
    if (idx !== -1) {
      const baseLayerVisible = baseLayers.splice(idx, 1);
      baseLayers.unshift(baseLayerVisible[0]);
    }

    this.setState({
      layers: layerService
        .getLayersAsFlatArray()
        .filter(l => {
          return (
            !l.getIsBaseLayer() &&
            l.getVisible() &&
            !l.hasVisibleChildren() &&
            !isLayerHidden(l)
          );
        })
        .map(l => l.getKey())
        .join(),
      baselayers:
        baseLayers.length > 1
          ? baseLayers.map(l => l.getKey()).join()
          : undefined,
    });
  }

  updateHistory() {
    const { params, history } = this.props;
    const oldParams = qs.parse(window.location.search);
    const parameters = { ...oldParams, ...params, ...this.state };
    // encodeURI to encode spaces, accents, etc. but not characters like ;,/?:@&=+$-_.!~*'()
    const qStr = encodeURI(qs.stringify(parameters, { encode: false }));
    const search = qStr ? `?${qStr}` : '';

    if (
      (!qStr && window.location.search) ||
      (qStr && search !== window.location.search)
    ) {
      if (history) {
        history.replace({ search });
      } else {
        const { hash } = window.location;
        window.history.replaceState(
          undefined,
          undefined,
          `${search}${hash || ''}`,
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
