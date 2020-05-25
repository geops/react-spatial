/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft } from 'react-icons/fa';
import Layer from '../../layers/Layer';

import './BaseLayerSwitcher.scss';

const propTypes = {
  /**
   * An array of react-spatial layers.
   */
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,

  /**
   * Object containing relative paths to the base layer images. Object
   * keys need to correspond to layer keys
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

  /**
   * Image (node) rendered in the switcher close button.
   */
  closeButtonImage: PropTypes.node,

  /**
   * Translation function.
   * @param {function} Translation function returning the translated string.
   */
  t: PropTypes.func,
};

const defaultProps = {
  className: 'rs-base-layer-switcher',
  altText: 'Source not found',
  titles: {
    button: 'Base layers',
    openSwitcher: 'Open Baselayer-Switcher',
    closeSwitcher: 'Close Baselayer-Switcher',
  },
  closeButtonImage: <FaChevronLeft />,
  layerImages: undefined,
  t: (s) => s,
};

const getVisibleLayer = (layers) => {
  return layers.find((layer) => layer.getVisible());
};

const getNextImage = (currentLayer, layers, layerImages) => {
  const currentIndex = layers.indexOf(
    layers.find((layer) => layer === currentLayer),
  );
  const nextIndex = currentIndex + 1 === layers.length ? 0 : currentIndex + 1;
  return layerImages[nextIndex];
};

const getImageStyle = (url) => {
  return url
    ? {
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }
    : null;
};

function BaseLayerSwitcher({
  layers,
  layerImages,
  className,
  altText,
  titles,
  closeButtonImage,
  t,
}) {
  const baseLayers = layers.filter((layer) => layer.getIsBaseLayer());
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [currentLayer, setCurrentLayer] = useState(
    getVisibleLayer(baseLayers) || baseLayers[0],
  );

  /* Images are loaded from props if provided, fallback from layer */
  const images = layerImages
    ? Object.keys(layerImages).map((layerImage) => layerImages[layerImage])
    : baseLayers.map((layer) => layer.get('previewImage'));

  const openClass = switcherOpen ? ' rs-open' : '';
  const hiddenStyle = switcherOpen && !isClosed ? 'visible' : 'hidden';

  const onLayerSelect = (layer) => {
    if (!switcherOpen) {
      setSwitcherOpen(true);
      return;
    }
    setCurrentLayer(layer);
    layer.setVisible(true);
    setSwitcherOpen(false);
  };

  /* Get next image for closed button */
  const nextImage = getNextImage(currentLayer, baseLayers, images);

  useEffect(() => {
    /* Ensure correct layer is active on app load */
    if (currentLayer !== getVisibleLayer(baseLayers)) {
      setCurrentLayer(getVisibleLayer(baseLayers) || baseLayers[0]);
    }
  }, [currentLayer, baseLayers]);

  useEffect(() => {
    /* Used for correct layer image render with animation */
    let timeout;
    if (!switcherOpen) {
      timeout = setTimeout(() => {
        setIsClosed(true);
      }, 200);
    } else {
      timeout = setTimeout(() => {
        setIsClosed(false);
      }, 800);
    }
    return () => clearTimeout(timeout);
  }, [switcherOpen]);

  if (!baseLayers || baseLayers.length < 2) {
    return null;
  }

  const toggleBtn = (
    <div className="rs-base-layer-switcher-btn-wrapper">
      <div
        className="rs-base-layer-switcher-close-btn"
        role="button"
        onClick={() => setSwitcherOpen(false)}
        onKeyPress={(e) => e.which === 13 && setSwitcherOpen(false)}
        tabIndex={switcherOpen ? '0' : '-1'}
        aria-label={altText}
        title={titles.closeSwitcher}
      >
        {closeButtonImage}
      </div>
    </div>
  );

  return (
    <div className={`${className}${openClass}`}>
      {
        <div
          className={`rs-base-layer-switcher-button rs-opener${openClass}`}
          role="button"
          title={titles.openSwitcher}
          aria-label={altText}
          onClick={() => setSwitcherOpen(true) && setIsClosed(false)}
          onKeyPress={(e) =>
            e.which === 13 && setSwitcherOpen(true) && setIsClosed(false)
          }
          style={getImageStyle(nextImage)}
          tabIndex="0"
        >
          <div className="rs-base-layer-switcher-title">{titles.button}</div>
          {nextImage ? null : <span className="rs-alt-text">{t(altText)}</span>}
        </div>
      }
      {baseLayers.map((layer, idx) => {
        const layerName = layer.getName();
        const activeClass =
          layerName === currentLayer.getName() ? ' rs-active' : '';
        const imageStyle = getImageStyle(
          layerImages ? layerImages[`${layer.key}`] : layer.get('previewImage'),
        );
        return (
          <div
            key={layer.key}
            className="rs-base-layer-switcher-btn-wrapper"
            style={{
              overflow: hiddenStyle,
              zIndex: baseLayers.length - idx,
            }}
          >
            <div
              className={`rs-base-layer-switcher-button${openClass}`}
              role="button"
              title={t(layerName)}
              aria-label={t(layerName)}
              onClick={() => onLayerSelect(layer)}
              onKeyPress={(e) => {
                if (e.which === 13) {
                  onLayerSelect(layer);
                }
              }}
              style={imageStyle}
              tabIndex={switcherOpen ? '0' : '-1'}
            >
              <div className={`rs-base-layer-switcher-title${activeClass}`}>
                {t(layerName)}
              </div>
              {imageStyle ? null : (
                <span className="rs-alt-text">{t(altText)}</span>
              )}
            </div>
          </div>
        );
      })}
      {toggleBtn}
    </div>
  );
}

BaseLayerSwitcher.propTypes = propTypes;
BaseLayerSwitcher.defaultProps = defaultProps;

export default BaseLayerSwitcher;
