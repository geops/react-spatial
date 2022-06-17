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
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
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

  /**
   * Custom function to be called when the permalink is updated.
   * This property has priority over the history parameter and window.history.replaceState calls.
   */
  replace: PropTypes.func,
};

const defaultProps = {
  history: null,
  layerService: null,
  map: null,
  params: {},
  coordinateDecimals: 2,
  isLayerHidden: () => {
    return false;
  },
  replace: null,
};

/**
 * This component handles permalink logic. Injecting an
 * __[ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)__
 * will add the *map center* (x, y) and the *zoom* (z) parameters to the permalink.
 * Injecting a
 * __[layerService](https://github.com/geops/react-spatial/blob/master/src/LayerService.js)__
 * (including at least one layer)
 * will add the *baselayers* and/or *layers* parameters. Further parameters can
 * be added using __params__.
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
        layerService.getLayersAsFlatArray().forEach((l) => {
          if (visibleLayers.includes(l.key)) {
            l.setVisible(true);
          } else if (
            !l.isBaseLayer &&
            !l.hasVisibleChildren() &&
            !isLayerHidden(l)
          ) {
            l.setVisible(false);
          }
        });
      }

      // Set baser layer visibility based on 'baseLayers' parameter.
      const visibleBaseLayers = (urlParams.baselayers || '').split(',');
      layerService.getBaseLayers().forEach((baseLayer) => {
        if (baseLayer.key === visibleBaseLayers[0]) {
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
      this.moveEndRef = map.on('moveend', () => {
        return this.onMapMoved();
      });
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
    const center = mapView.getCenter();
    const params = {};

    if (
      center !== undefined &&
      center[0] !== undefined &&
      center[1] !== undefined
    ) {
      params.x = this.roundCoord(center[0]);
      params.y = this.roundCoord(center[1]);
    }

    this.setState({
      ...params,
      // rounds zoom to two digits max.
      z: +`${Math.round(`${parseFloat(mapView.getZoom())}e+2`)}e-2`,
    });
  }

  roundCoord(val) {
    const { coordinateDecimals } = this.props;
    return parseFloat(val.toFixed(coordinateDecimals));
  }

  updateLayerService() {
    const { layerService } = this.props;
    if (layerService) {
      layerService.un('change:visible', this.updateState);
      layerService.un('change:layers', this.updateLayers);
      this.updateLayers();
      layerService.on('change:layers', this.updateLayers);
      layerService.on('change:visible', this.updateLayers);
    }
  }

  updateLayers() {
    const { layerService, isLayerHidden } = this.props;
    const baseLayers = layerService.getBaseLayers();
    const idx = baseLayers.findIndex((l) => {
      return l.visible;
    });
    if (idx !== -1) {
      const baseLayerVisible = baseLayers.splice(idx, 1);
      baseLayers.unshift(baseLayerVisible[0]);
    }

    this.setState({
      layers: layerService
        .getLayersAsFlatArray()
        .filter((l) => {
          return (
            !l.isBaseLayer &&
            l.visible &&
            (!l.hasVisibleChildren() ||
              (l.children || []).every((child) => {
                return isLayerHidden(child);
              })) &&
            !isLayerHidden(l)
          );
        })
        .map((l) => {
          return l.key;
        })
        .join(),
      baselayers:
        baseLayers.length > 1
          ? baseLayers
              .map((l) => {
                return l.key;
              })
              .join()
          : undefined,
    });
  }

  updateHistory() {
    const { params, history, replace } = this.props;
    const oldParams = qs.parse(window.location.search);
    const parameters = { ...oldParams, ...this.state, ...params };

    // Remove parameters that are undefined or null
    Object.entries(parameters).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        delete parameters[key];
      }
    });

    // encodeURI to encode spaces, accents, etc. but not characters like ;,/?:@&=+$-_.!~*'()
    const qStr = encodeURI(qs.stringify(parameters, { encode: false }));
    const search = qStr ? `?${qStr}` : '';

    if (
      (!qStr && window.location.search) ||
      (qStr && search !== window.location.search)
    ) {
      if (replace) {
        replace({ parameters, search });
      } else if (history) {
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
