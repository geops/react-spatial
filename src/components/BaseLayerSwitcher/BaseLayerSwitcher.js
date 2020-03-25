/* eslint-disable jsx-a11y/interactive-supports-focus */
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
  layerImages: PropTypes.objectOf(PropTypes.string),

  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * Alternaive text rendered if layer images can't be loaded
   */
  altText: PropTypes.string,

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
  altText: 'Source not found',
  titles: {
    button: 'Base layers',
    openSwitcher: 'Open Baselayer-Switcher',
    closeSwitcher: 'Close Baselayer-Switcher',
  },
  layerImages: undefined,
};

const getVisibleLayer = layers => {
  return layers.find(layer => layer.getVisible());
};

const getNextImage = (currentLayer, layers, layerImages) => {
  const currentIndex = layers.indexOf(
    layers.find(layer => layer === currentLayer),
  );
  const nextIndex = currentIndex + 1 === layers.length ? 0 : currentIndex + 1;
  return layerImages[nextIndex];
};

function BaseLayerSwitcher({
  layers,
  layerImages,
  altText,
  className,
  titles,
}) {
  const baseLayers = layers.filter(layer => layer.getIsBaseLayer());
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [currentLayer, setCurrentLayer] = useState(getVisibleLayer(baseLayers));
  /* Images are loaded from props if provided, fallback from layer */
  const images = layerImages
    ? Object.keys(layerImages).map(layerImage => layerImages[layerImage])
    : baseLayers.map(layer => layer.previewImage);

  if (!baseLayers || baseLayers.length < 2) {
    return null;
  }

  useEffect(() => {
    /* Ensure correct layer is active on app load */
    if (currentLayer !== getVisibleLayer(baseLayers)) {
      setCurrentLayer(getVisibleLayer(baseLayers));
    }
  }, [currentLayer]);

  useEffect(() => {
    /* Used for correct layer image render with animation */
    if (!switcherOpen) {
      const timeout = setTimeout(() => {
        setIsClosed(true);
      }, 200);
      return () => clearTimeout(timeout);
    }
    return setIsClosed(false);
  }, [switcherOpen]);

  const toggleBtn =
    baseLayers.length > 0 ? (
      <div
        className="rs-base-layer-switch-close"
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
          const layerName = layer.getName();
          return (
            <div
              key={layer.key}
              className={`rs-base-layer-switch-button${
                switcherOpen ? ' open' : ''
              }${layerName === currentLayer.getName() ? ' rs-active' : ''}`}
              role="button"
              title={isClosed ? titles.openSwitcher : layerName}
              aria-label={isClosed ? titles.openSwitcher : layerName}
              onClick={() => {
                if (!switcherOpen) {
                  setSwitcherOpen(true);
                  return;
                }
                setCurrentLayer(layer);
                layer.setVisible(true);
                setSwitcherOpen(false);
              }}
              onKeyPress={e => {
                if (e.which === 13) {
                  if (!switcherOpen) {
                    setSwitcherOpen(true);
                  } else {
                    layer.setVisible(true);
                    setCurrentLayer(layer);
                    setSwitcherOpen(false);
                  }
                }
              }}
              tabIndex={`${isClosed ? index : '0'}`}
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
                    ? getNextImage(currentLayer, baseLayers, images)
                    : images[index]
                }
                alt={altText}
                className="rs-base-layer-switch-image"
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
