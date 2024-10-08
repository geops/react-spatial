import { getLayersAsFlatArray, Layer } from "mobility-toolbox-js/ol";
import OLMap from "ol/Map";
import { unByKey } from "ol/Observable";
import PropTypes from "prop-types";
import { PureComponent } from "react";

const propTypes = {
  /**
   * Maximum number of decimals allowed for coordinates.
   */
  coordinateDecimals: PropTypes.number,

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
   * Determine if the layer appears in the baselayers permalink parameter or not.
   *
   * @param {object} item The item to hide or not.
   *
   * @return {bool} true if the item is not displayed in the baselayers permalink parameter
   */
  isBaseLayer: PropTypes.func,

  /**
   * Determine if the layer is hidden in the permalink or not.
   *
   * @param {object} item The item to hide or not.
   *
   * @return {bool} true if the item is not displayed in the permalink
   */
  isLayerHidden: PropTypes.func,

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
   * Custom function to be called when the permalink is updated.
   * This property has priority over the history parameter and window.history.replaceState calls.
   */
  replace: PropTypes.func,
};

const defaultProps = {
  coordinateDecimals: 2,
  history: null,
  isBaseLayer: (layer) => {
    return layer.get("isBaseLayer");
  },
  isLayerHidden: () => {
    return false;
  },
  layers: [],
  map: null,
  params: {},
  replace: null,
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
    this.onPropertyChangeKeys = [];
  }

  componentDidMount() {
    const { isBaseLayer, isLayerHidden, layers, map } = this.props;
    if (map) {
      this.moveEndRef = map.on("moveend", () => {
        this.onMapMoved();
      });
    }

    if (layers) {
      // set layer visibility based on 'layers' parameter.
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.get("layers")) {
        const visibleLayers = urlParams.get("layers").split(",");
        getLayersAsFlatArray(layers).forEach((l) => {
          if (visibleLayers.includes(l.key)) {
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
      const visibleBaseLayer = (urlParams.get("baselayers") || "").split(
        ",",
      )[0];
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
    const { layers, map } = this.props;
    const { revision } = this.state;

    if (layers !== prevProps.layers || revision !== prevState.revision) {
      this.updateLayers();
    }

    if (map !== prevProps.map) {
      unByKey(this.moveEndRef);
      this.moveEndRef = map.on("moveend", () => {
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

  render() {
    return null;
  }

  roundCoord(val) {
    const { coordinateDecimals } = this.props;
    return parseFloat(val.toFixed(coordinateDecimals));
  }

  updateHistory() {
    const { history, params, replace } = this.props;
    const oldParams = new URLSearchParams(window.location.search);
    const parameters = {
      ...Object.fromEntries(oldParams.entries()),
      ...this.state,
      ...params,
    };

    delete parameters.revision;

    // Remove parameters that are undefined or null
    Object.entries(parameters).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        delete parameters[key];
      }
    });

    // We don't encode the , to leave the permalink lisible
    const qStr = new URLSearchParams(parameters)
      .toString()
      .replace(/%2C/g, ",");
    const search = qStr ? `?${qStr}` : "";

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
          `${search}${hash || ""}`,
        );
      }
    }
  }

  updateLayers() {
    const { isBaseLayer, isLayerHidden, layers } = this.props;
    const { revision } = this.state;

    unByKey(this.onPropertyChangeKeys);
    this.onPropertyChangeKeys = getLayersAsFlatArray(layers).map((layer) => {
      return layer.on("change:visible", () => {
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
      // First baselayers in order of visibility, top layer is first
      const visibleBaseLayers = (
        baseLayers.filter((l) => {
          return l.visible;
        }) || []
      ).reverse();
      const nonVisibleBaseLayers =
        baseLayers.filter((l) => {
          return !l.visible;
        }) || [];
      baseLayersParam = [...visibleBaseLayers, ...nonVisibleBaseLayers]
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
      baselayers: baseLayersParam,
      layers: layersParam,
    });
  }
}

Permalink.propTypes = propTypes;
Permalink.defaultProps = defaultProps;

export default Permalink;
