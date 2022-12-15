import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import OLMap from 'ol/Map';
import { unByKey } from 'ol/Observable';
import { Layer, getLayersAsFlatArray } from 'mobility-toolbox-js/ol';

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
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)),

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
   * Determine if the layer appears in the baselayers permalink parameter or not.
   *
   * @param {object} item The item to hide or not.
   *
   * @return {bool} true if the item is not displayed in the baselayers permalink parameter
   */
  isBaseLayer: PropTypes.func,

  /**
   * Custom function to be called when the permalink is updated.
   * This property has priority over the history parameter and window.history.replaceState calls.
   */
  replace: PropTypes.func,
};

const defaultProps = {
  history: null,
  replace: null,
  layers: [],
  map: null,
  params: {},
  coordinateDecimals: 2,
  isLayerHidden: () => {
    return false;
  },
  isBaseLayer: (layer) => {
    return layer.get('isBaseLayer');
  },
};

/**
 * This component handles permalink logic. Injecting an
 * __[ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)__
 * will add the *map center* (x, y) and the *zoom* (z) parameters to the permalink.
 * Injecting layers will add the *baselayers* and/or *layers* parameters. Further parameters can
 * be added using __params__.
 */
class Permalink extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { revision: 0 };
    this.onMoveEndRef = null;
    this.onPropertyChangeKeys = [];
  }

  componentDidMount() {
    const { map, layers, isLayerHidden, isBaseLayer } = this.props;
    if (map) {
      this.moveEndRef = map.on('moveend', () => {
        this.onMapMoved();
      });
    }

    if (layers) {
      // set layer visibility based on 'layers' parameter.
      const urlParams = qs.parse(window.location.search);

      if (urlParams.layers) {
        const visibleLayers = urlParams.layers.split(',');
        getLayersAsFlatArray(layers).forEach((l) => {
          if (visibleLayers.includes(l.key)) {
            console.log('layers visible true', l.key);
            if (l.setVisible) {
              l.setVisible(true);
            } else {
              // eslint-disable-next-line no-param-reassign
              l.visible = true;
            }
          } else if (
            !isBaseLayer(l) &&
            !isLayerHidden(l) &&
            !l.children.some((ll) => {
              return ll.visible;
            })
          ) {
            console.log('layers visible false', l.key);
            if (l.setVisible) {
              l.setVisible(false);
            } else {
              // eslint-disable-next-line no-param-reassign
              l.visible = false;
            }
          }
        });
      }

      // Set baser layer visibility based on 'baseLayers' parameter.
      // Show the first of the list then hide the others
      const visibleBaseLayer = (urlParams.baselayers || '').split(',')[0];
      if (visibleBaseLayer) {
        getLayersAsFlatArray(layers)
          .filter(isBaseLayer)
          .forEach((baseLayer) => {
            const visible = baseLayer.key === visibleBaseLayer;
            if (baseLayer.setVisible) {
              baseLayer.setVisible(visible);
            } else {
              // eslint-disable-next-line no-param-reassign
              baseLayer.visible = visible;
            }
          });
      }
      this.updateLayers();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { map, layers } = this.props;
    const { revision } = this.state;

    if (layers !== prevProps.layers || revision !== prevState.revision) {
      this.updateLayers();
    }

    if (map !== prevProps.map) {
      unByKey(this.moveEndRef);
      this.moveEndRef = map.on('moveend', () => {
        return this.onMapMoved();
      });
    }

    this.updateHistory();
  }

  componentWillUnmount() {
    const { map } = this.props;

    if (map) {
      unByKey(this.moveEndRef);
    }
    unByKey(this.onPropertyChangeKeys);
    this.onPropertyChangeKeys = [];
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

  updateLayers() {
    const { layers, isLayerHidden, isBaseLayer } = this.props;
    const { revision } = this.state;

    unByKey(this.onPropertyChangeKeys);
    this.onPropertyChangeKeys = getLayersAsFlatArray(layers).map((layer) => {
      return layer.on('change:visible', () => {
        this.setState({ revision: revision + 1 });
      });
    });

    // layers param
    let layersParam;
    if (layers.length) {
      layersParam = getLayersAsFlatArray(layers)
        .filter((l) => {
          const children = l.children || [];
          const allChildrenHidden = children.every((child) => {
            return isLayerHidden(child);
          });
          const hasVisibleChildren = children.some((child) => {
            return child.visible;
          });
          return (
            !isBaseLayer(l) &&
            !isLayerHidden(l) &&
            l.visible &&
            (!hasVisibleChildren || allChildrenHidden)
          );
        })
        .map((l) => {
          return l.key;
        })
        .join();
    }

    // baselayers param
    let baseLayersParam;
    const baseLayers = getLayersAsFlatArray(layers).filter(isBaseLayer);
    if (baseLayers.length) {
      baseLayersParam = baseLayers
        .sort((a, b) => {
          if (a.visible === b.visible) {
            return 0;
          }
          if (a.visible && !b.visible) {
            return -1;
          }
          return 1;
        })
        .map((l) => {
          return l.key;
        })
        .join();
    }

    // Only add parameters if there is actually some layers added.
    this.setState({
      layers: layersParam,
      baselayers: baseLayersParam,
    });
  }

  updateHistory() {
    const { params, history, replace } = this.props;
    const oldParams = qs.parse(window.location.search);
    const parameters = { ...oldParams, ...this.state, ...params };

    delete parameters.revision;

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
