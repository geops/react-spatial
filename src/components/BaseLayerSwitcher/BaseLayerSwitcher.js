/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft } from 'react-icons/fa';
import { Layer } from 'mobility-toolbox-js/ol';
import { unByKey } from 'ol/Observable';

const propTypes = {
  /**
   * An array of [mobility-toolbox-js layers](https://mobility-toolbox-js.geops.io/api/identifiers%20html#ol-layers).
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
  t: (s) => {
    return s;
  },
};

const getVisibleLayer = (layers) => {
  return layers.find((layer) => {
    return layer.visible;
  });
};

const getNextImage = (currentLayer, layers, layerImages) => {
  const currentIndex = layers.indexOf(
    layers.find((layer) => {
      return layer === currentLayer;
    }),
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

/**
 * The BaseLayerSwitcher component renders a button interface for switching the visible
 * [mobility-toolbox-js layer](https://mobility-toolbox-js.geops.io/api/identifiers%20html#ol-layers)
 * when defined as base layer.
 */

function BaseLayerSwitcher({
  layers,
  layerImages,
  className,
  altText,
  titles,
  closeButtonImage,
  t,
}) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [currentLayer, setCurrentLayer] = useState(
    getVisibleLayer(layers) || layers[0],
  );

  useEffect(() => {
    // Update the layer selected when a visibility changes.
    const olKeys = (layers || []).map((layer) => {
      return layer.on('change:visible', (evt) => {
        if (evt.target.visible && currentLayer !== evt.target) {
          setCurrentLayer(evt.target);
        }
      });
    });
    return () => {
      unByKey(olKeys);
    };
  }, [currentLayer, layers]);

  /* Images are loaded from props if provided, fallback from layer */
  const images = layerImages
    ? Object.keys(layerImages).map((layerImage) => {
        return layerImages[layerImage];
      })
    : layers.map((layer) => {
        return layer.get('previewImage');
      });

  const openClass = switcherOpen ? ' rs-open' : '';
  const hiddenStyle = switcherOpen && !isClosed ? 'visible' : 'hidden';

  const handleSwitcherClick = () => {
    if (layers.length === 2) {
      /* On only two layer options the opener becomes a layer toggle button */
      const nextLayer = layers.find((layer) => {
        return !layer.visible;
      });
      if (currentLayer.setVisible) {
        currentLayer.setVisible(false);
      } else {
        currentLayer.visible = false;
      }
      setCurrentLayer(nextLayer);
      if (nextLayer.setVisible) {
        nextLayer.setVisible(true);
      } else {
        nextLayer.visible = true;
      }
      return;
    }
    // eslint-disable-next-line consistent-return
    return setSwitcherOpen(true) && setIsClosed(false);
  };

  const onLayerSelect = (layer) => {
    if (!switcherOpen) {
      setSwitcherOpen(true);
      return;
    }
    setCurrentLayer(layer);
    if (layer.setVisible) {
      layer.setVisible(true);
    } else {
      // eslint-disable-next-line no-param-reassign
      layer.visible = true;
    }
    layers
      .filter((l) => {
        return l !== layer;
      })
      .forEach((l) => {
        if (l.setVisible) {
          l.setVisible(false);
        } else {
          // eslint-disable-next-line no-param-reassign
          l.visible = false;
        }
      });
    setSwitcherOpen(false);
  };

  /* Get next image for closed button */
  const nextImage = getNextImage(currentLayer, layers, images);

  useEffect(() => {
    /* Ensure correct layer is active on app load */
    if (currentLayer !== getVisibleLayer(layers)) {
      setCurrentLayer(getVisibleLayer(layers) || layers[0]);
    }
  }, [currentLayer, layers]);

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
    return () => {
      return clearTimeout(timeout);
    };
  }, [switcherOpen]);

  if (!layers || layers.length < 2 || !currentLayer) {
    return null;
  }

  const toggleBtn = (
    <div className="rs-base-layer-switcher-btn-wrapper">
      <div
        className="rs-base-layer-switcher-close-btn"
        role="button"
        onClick={() => {
          return setSwitcherOpen(false);
        }}
        onKeyPress={(e) => {
          return e.which === 13 && setSwitcherOpen(false);
        }}
        tabIndex={switcherOpen ? '0' : '-1'}
        aria-label={titles.closeSwitcher}
        title={titles.closeSwitcher}
      >
        {closeButtonImage}
      </div>
    </div>
  );

  return (
    <div className={`${className}${openClass}`}>
      <div
        className={`rs-base-layer-switcher-button rs-opener${openClass}`}
        role="button"
        title={titles.openSwitcher}
        aria-label={titles.openSwitcher}
        onClick={handleSwitcherClick}
        onKeyPress={(e) => {
          if (e.which === 13) {
            handleSwitcherClick();
          }
        }}
        style={getImageStyle(nextImage)}
        tabIndex="0"
      >
        <div className="rs-base-layer-switcher-title">
          {layers.length !== 2
            ? titles.button
            : layers.find((layer) => {
                return !layer.visible;
              }) &&
              t(
                layers.find((layer) => {
                  return !layer.visible;
                }).name,
              )}
        </div>
        {nextImage ? null : <span className="rs-alt-text">{t(altText)}</span>}
      </div>
      {layers.map((layer, idx) => {
        const layerName = layer.name;
        const activeClass = layerName === currentLayer.name ? ' rs-active' : '';
        const imageStyle = getImageStyle(
          layerImages ? layerImages[`${layer.key}`] : layer.get('previewImage'),
        );
        return (
          <div
            key={layer.key}
            className="rs-base-layer-switcher-btn-wrapper"
            style={{
              /* stylelint-disable-next-line value-keyword-case */
              overflow: hiddenStyle,
              /* stylelint-disable-next-line value-keyword-case */
              zIndex: layers.length - idx,
            }}
          >
            <div
              className={`rs-base-layer-switcher-button${openClass}`}
              role="button"
              title={t(layerName)}
              aria-label={t(layerName)}
              onClick={() => {
                return onLayerSelect(layer);
              }}
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
