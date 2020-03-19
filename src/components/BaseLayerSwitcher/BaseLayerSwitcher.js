import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronCircleLeft } from 'react-icons/fa';
import Layer from '../../layers/Layer';
import img from '../../images/baselayer/osm.baselayer.png';

import './BaseLayerSwitcher.scss';

const propTypes = {
  /**
   * An array of react-spatial layers.
   */
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,

  /**
   * Object containing relative paths to the base layer images.
   */
  layerImages: PropTypes.objectOf(PropTypes.string).isRequired,

  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * Button titles.
   */
  titles: PropTypes.shape({
    button: PropTypes.string,
    closeSwitcher: PropTypes.string,
  }),
};

const defaultProps = {
  className: 'rs-base-layer-switcher',
  titles: {
    button: 'Open Baselayer-Switcher',
    closeSwitcher: 'Close Baselayer-Switcher',
  },
};

const getNextImage = (currentLayer, layers, layerImages) => {
  const currentIndex = layers.indexOf(
    layers.find(layer => layer === currentLayer),
  );
  const nextIndex = currentIndex + 1 === layers.length ? 0 : currentIndex + 1;
  return layerImages[Object.keys(layerImages)[nextIndex]];
};

function BaseLayerSwitcher({ layers, layerImages, className, titles }) {
  const baseLayers = layers.filter(layer => layer.getIsBaseLayer());
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [currentLayer, setCurrentlayer] = useState(baseLayers[0]);
  const images = Object.keys(layerImages).map(
    layerImage => layerImages[layerImage],
  );

  if (!baseLayers || baseLayers.length < 2) {
    return null;
  }

  const toggleBtn =
    baseLayers.length > 0 ? (
      <div
        className="rs-base-layer-toggle"
        role="button"
        onClick={() => setSwitcherOpen(false)}
        onKeyPress={e => e.which === 13 && setSwitcherOpen(false)}
        tabIndex="0"
        aria-label={titles.closeSwitcher}
        title={titles.closeSwitcher}
      >
        <FaChevronCircleLeft size={15} focusable={false} />
      </div>
    ) : null;

  return (
    <div className={`${className}${switcherOpen ? ' open' : ''}`}>
      {switcherOpen ? toggleBtn : null}
      {switcherOpen ? (
        baseLayers.map((layer, index) => {
          const layerName = layers[index].getName();
          return (
            <div
              key={baseLayers[index].key}
              className={`rs-base-layer-switch-button layer${
                baseLayers[index].getName() === currentLayer.getName()
                  ? ' active'
                  : ''
              }`}
              role="button"
              title={layerName}
              aria-label={layerName}
              onClick={() => {
                setCurrentlayer(baseLayers[index]);
                baseLayers[index].setVisible(true);
                setSwitcherOpen(false);
              }}
              onKeyPress={e =>
                e.which === 13 &&
                baseLayers[index].setVisible(true) &&
                setCurrentlayer(baseLayers[index]) &&
                setSwitcherOpen(false)
              }
              tabIndex={index}
            >
              <div className="rs-base-layer-switch-title">{layerName}</div>
              <img
                src={images[index]}
                alt="foobar"
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
          onClick={() => setSwitcherOpen(!switcherOpen)}
          onKeyPress={e => e.which === 13 && setSwitcherOpen(!switcherOpen)}
          tabIndex="0"
        >
          <div className="rs-base-layer-switch-title closed">Base layers</div>
          <img
            src={getNextImage(currentLayer, baseLayers, layerImages)}
            alt="foobar"
            className="rs-base-layer-image"
          />
        </div>
      )}
    </div>
  );
}

BaseLayerSwitcher.propTypes = propTypes;
BaseLayerSwitcher.defaultProps = defaultProps;

export default BaseLayerSwitcher;
