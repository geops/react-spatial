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
   * Alternative text rendered if layer images can't be loaded
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

  const openClass = switcherOpen ? ' rs-open' : '';
  const closedClass = isClosed ? ' rs-closed' : '';

  const onButtonSelect = (open, layer) => {
    if (!open) {
      setSwitcherOpen(true);
      return;
    }
    setCurrentLayer(layer);
    layer.setVisible(true);
    setSwitcherOpen(false);
  };

  const setTabIndex = (closed, buttonIndex) => {
    if (closed) {
      return buttonIndex === 0 ? '0' : '-1';
    }
    return '0';
  };

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
    let timeout;
    if (!switcherOpen) {
      timeout = setTimeout(() => {
        setIsClosed(true);
      }, 200);
    } else {
      setIsClosed(false);
    }
    return () => clearTimeout(timeout);
  }, [switcherOpen]);

  const toggleBtn =
    baseLayers.length > 0 ? (
      <div
        className="rs-base-layer-switcher-button rs-close"
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
    <div className={`${className}${openClass}`}>
      <div className="rs-base-layer-switcher-layers">
        {!isClosed && toggleBtn}
        {baseLayers.map((layer, index) => {
          const layerName = layer.getName();
          const buttonTitle = isClosed ? titles.openSwitcher : layerName;
          const activeClass =
            layerName === currentLayer.getName() ? ' rs-active' : '';
          return (
            <div
              key={layer.key}
              className={`rs-base-layer-switcher-button rs-layer${openClass}${activeClass}`}
              role="button"
              title={buttonTitle}
              aria-label={buttonTitle}
              onClick={() => onButtonSelect(switcherOpen, layer)}
              onKeyPress={e => {
                if (e.which === 13) {
                  onButtonSelect(switcherOpen, layer);
                }
              }}
              tabIndex={setTabIndex(isClosed, index)}
            >
              {isClosed ? (
                <>
                  <div className={`rs-base-layer-switcher-title${closedClass}`}>
                    {titles.button}
                  </div>
                  <img
                    src={getNextImage(currentLayer, baseLayers, images)}
                    alt={altText}
                    className="rs-base-layer-switcher-image"
                  />
                </>
              ) : (
                <>
                  <div className="rs-base-layer-switcher-title">
                    {layerName}
                  </div>
                  <img
                    src={images[index]}
                    alt={altText}
                    className="rs-base-layer-switcher-image"
                  />
                </>
              )}
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
