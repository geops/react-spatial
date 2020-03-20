import React, { useState, useEffect } from 'react';
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
    openSwitcher: PropTypes.string,
    closeSwitcher: PropTypes.string,
  }),
};

const defaultProps = {
  className: 'rs-base-layer-switcher',
  titles: {
    button: 'Base layers',
    openSwitcher: 'Open Baselayer-Switcher',
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

let timeout;

function BaseLayerSwitcher({ layers, layerImages, className, titles }) {
  const baseLayers = layers.filter(layer => layer.getIsBaseLayer());
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [currentLayer, setCurrentlayer] = useState(
    baseLayers.find(layer => layer.getVisible()),
  );
  const images = Object.keys(layerImages).map(
    layerImage => layerImages[layerImage],
  );

  if (!baseLayers || baseLayers.length < 2) {
    return null;
  }

  useEffect(() => {
    /* Used for correct layer image render with animation */
    if (!switcherOpen) {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        setIsClosed(true);
      }, 200);
      return;
    }
    setIsClosed(false);
  }, [switcherOpen]);

  const toggleBtn =
    baseLayers.length > 0 ? (
      <div
        className="rs-base-layer-close"
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
      <div className="rs-base-layer-switch-layers">
        {switcherOpen ? toggleBtn : null}
        {baseLayers.map((layer, index) => {
          const layerName = layers[index].getName();
          return (
            <div
              key={baseLayers[index].key}
              className={`rs-base-layer-switch-button${
                switcherOpen ? ' layer' : ''
              }${
                baseLayers[index].getName() === currentLayer.getName()
                  ? ' active'
                  : ''
              }`}
              role="button"
              title={isClosed ? titles.openSwitcher : layerName}
              aria-label={isClosed ? titles.openSwitcher : layerName}
              onClick={() => {
                if (!switcherOpen) {
                  setSwitcherOpen(true);
                  return;
                }
                setCurrentlayer(baseLayers[index]);
                baseLayers[index].setVisible(true);
                setSwitcherOpen(false);
              }}
              onKeyPress={e => {
                if (e.which === 13) {
                  if (!switcherOpen) {
                    setSwitcherOpen(true);
                  } else {
                    baseLayers[index].setVisible(true);
                    setCurrentlayer(baseLayers[index]);
                    setSwitcherOpen(false);
                  }
                }
              }}
              tabIndex="0"
            >
              <div
                className={`rs-base-layer-switch-title${
                  isClosed ? ' closed' : ''
                }`}
              >
                {isClosed ? titles.button : layerName}
              </div>
              <img
                src={
                  isClosed
                    ? getNextImage(currentLayer, baseLayers, layerImages)
                    : images[index]
                }
                alt="Failed loading source"
                className="rs-base-layer-image"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

BaseLayerSwitcher.propTypes = propTypes;
BaseLayerSwitcher.defaultProps = defaultProps;

export default BaseLayerSwitcher;
