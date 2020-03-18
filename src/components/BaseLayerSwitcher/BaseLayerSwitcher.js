import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft } from 'react-icons/fa';
import OLMap from 'ol/Map';
import LayerService from '../../LayerService';

import './BaseLayerSwitcher.scss';

const propTypes = {
  /**
   * An ol.Map.
   */
  map: PropTypes.instanceOf(OLMap).isRequired,

  /**
   * LayerService.
   */
  layerService: PropTypes.instanceOf(LayerService),

  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * Path to the directory which includes the fallback images
   */
  // fallbackImgDir: PropTypes.string,

  /**
   * Outside of this valid extent the fallback image is loaded
   */
  // validExtent: PropTypes.arrayOf(PropTypes.number),

  /**
   * Button titles.
   */
  titles: PropTypes.shape({
    button: PropTypes.string,
    closeSwitcher: PropTypes.string,
  }),
};

const defaultProps = {
  layerService: undefined,
  className: 'rs-base-layer-switcher',
  // fallbackImgDir: '../../images/baselayer/',
  // validExtent: [-Infinity, -Infinity, Infinity, Infinity],
  titles: {
    button: 'Open Baselayer-Switcher',
    closeSwitcher: 'Close Baselayer-Switcher',
  },
};

class BaseLayerSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: null,
      // layerVisible: null
      fallbackImg: null,
      fallbackImgOpacity: 0,
      switcherOpen: false,
    };
    this.map = null;
    this.ref = React.createRef();
  }

  componentDidMount() {
    const { layerService, map } = this.props;
    const layers = layerService.getBaseLayers() || [];

    if (map) {
      this.setState({ layers });
    }
  }

  render() {
    const { className, titles } = this.props;
    const {
      layers,
      fallbackImg,
      fallbackImgOpacity,
      switcherOpen,
    } = this.state;

    if (!layers || layers.length < 2) {
      return null;
    }

    const toggleBtn =
      layers.length > 0 ? (
        <div
          className="rs-base-layer-toggle"
          role="button"
          onClick={() => this.setState({ switcherOpen: !switcherOpen })}
          onKeyPress={e =>
            e.which === 13 && this.setState({ switcherOpen: !switcherOpen })
          }
          tabIndex="0"
          aria-label={titles.closeSwitcher}
          title={titles.closeSwitcher}
        >
          <FaChevronLeft focusable={false} />
        </div>
      ) : null;

    return (
      <div
        className={`${className}${switcherOpen ? ' open' : ''}`}
        ref={this.ref}
      >
        {switcherOpen ? toggleBtn : null}
        {switcherOpen ? (
          layers.map((layer, index) => {
            return (
              <div
                className="rs-base-layer-switch-button"
                role="button"
                title={layers[index].getName()}
                aria-label={layers[index].getName()}
                onClick={() => layers[index].setVisible(true)}
                onKeyPress={e =>
                  e.which === 13 && layers[index].setVisible(true)
                }
                tabIndex={index}
              >
                <div className="rs-base-layer-switch-title">
                  {layers[index].getName()}
                </div>
                <img
                  src={fallbackImg}
                  alt={fallbackImg}
                  style={{ opacity: fallbackImgOpacity }}
                  className="rs-base-layer-image"
                />
              </div>
            );
          })
        ) : (
          <div
            className="rs-base-layer-switch-button"
            role="button"
            title={titles.button}
            aria-label={titles.button}
            onClick={() => this.setState({ switcherOpen: !switcherOpen })}
            onKeyPress={e =>
              e.which === 13 && this.setState({ switcherOpen: !switcherOpen })
            }
            tabIndex="0"
          />
        )}
      </div>
    );
  }
}

BaseLayerSwitcher.propTypes = propTypes;
BaseLayerSwitcher.defaultProps = defaultProps;

export default BaseLayerSwitcher;
