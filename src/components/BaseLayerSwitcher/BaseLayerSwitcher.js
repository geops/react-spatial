/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChevronLeft from '../../images/chevronLeft.svg';
import Layer from '../../layers/Layer';

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
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };
};

function BaseLayerSwitcher({
  layers,
  layerImages,
  className,
  altText,
  titles,
  t,
}) {
  const baseLayers = layers.filter((layer) => layer.getIsBaseLayer());
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [currentLayer, setCurrentLayer] = useState(getVisibleLayer(baseLayers));

  /* Images are loaded from props if provided, fallback from layer */
  const images = layerImages
    ? Object.keys(layerImages).map((layerImage) => layerImages[layerImage])
    : baseLayers.map((layer) => layer.previewImage);

  const openClass = switcherOpen ? ' rs-open' : '';
  const closedClass = isClosed ? ' rs-closed' : '';

  const onLayerSelect = (layer) => {
    if (!switcherOpen) {
      setSwitcherOpen(true);
      return;
    }
    setCurrentLayer(layer);
    layer.setVisible(true);
    setSwitcherOpen(false);
  };

  const nextImage = getNextImage(currentLayer, baseLayers, images);

  useEffect(() => {
    /* Attach corresponding image to layers on load */
    baseLayers.forEach((baselayer, idx) => {
      // eslint-disable-next-line no-param-reassign
      baselayer.image = images[idx];
    });
  }, []);

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

  if (!baseLayers || baseLayers.length < 2) {
    return null;
  }

  const toggleBtn = (
    <div
      className="rs-base-layer-switcher-close-btn"
      role="button"
      onClick={() => setSwitcherOpen(false)}
      onKeyPress={(e) => e.which === 13 && setSwitcherOpen(false)}
      tabIndex="0"
      aria-label={altText}
      title={titles.closeSwitcher}
    >
      <ChevronLeft />
    </div>
  );

  return (
    <div className={`${className}${openClass}`}>
      {!isClosed && toggleBtn}
      {!isClosed ? (
        baseLayers
          .sort((l1) => (l1.name === currentLayer.name ? -1 : 0))
          .map((layer) => {
            const layerName = layer.getName();
            const activeClass =
              layerName === currentLayer.getName() ? ' rs-active' : '';
            return (
              <div
                key={layer.key}
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
                style={getImageStyle(layer.image)}
                tabIndex="0"
              >
                <div className={`rs-base-layer-switcher-title${activeClass}`}>
                  {t(layerName)}
                </div>
                {layer.image ? null : (
                  <span className="rs-alt-text">{t(altText)}</span>
                )}
              </div>
            );
          })
      ) : (
        <div
          className="rs-base-layer-switcher-button"
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
          <div className={`rs-base-layer-switcher-title${closedClass}`}>
            {titles.button}
          </div>
          {nextImage ? null : <span className="rs-alt-text">{t(altText)}</span>}
        </div>
      )}
    </div>
  );
}

BaseLayerSwitcher.propTypes = propTypes;
BaseLayerSwitcher.defaultProps = defaultProps;

export default BaseLayerSwitcher;
