/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft } from "react-icons/fa";
import { Layer } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";

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

  /**
   * Callback function on close button click.
   * @param {function} Callback function triggered when a switcher button is clicked. Takes the event as argument.
   */
  onCloseButtonClick: PropTypes.func,

  /**
   * Callback function on layer button click.
   * @param {function} Callback function triggered when a switcher button is clicked. Takes the event and the layer as arguments.
   */
  onLayerButtonClick: PropTypes.func,

  /**
   * Callback function on main switcher button click.
   * @param {function} Callback function triggered when a switcher button is clicked. Takes the event as argument.
   */
  onSwitcherButtonClick: PropTypes.func,
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
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }
    : null;
};

function CloseButton({ onClick, tabIndex, title, children }) {
  return (
    <div
      className="rs-base-layer-switcher-close-btn"
      role="button"
      onClick={onClick}
      onKeyPress={(e) => {
        return e.which === 13 && onClick();
      }}
      tabIndex={tabIndex}
      aria-label={title}
      title={title}
    >
      {children}
    </div>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  tabIndex: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * The BaseLayerSwitcher component renders a button interface for switching the visible
 * [mobility-toolbox-js layer](https://mobility-toolbox-js.geops.io/api/identifiers%20html#ol-layers)
 * when defined as base layer.
 */

function BaseLayerSwitcher({
  layers,
  layerImages = undefined,
  className = "rs-base-layer-switcher",
  altText = "Source not found",
  titles = {
    button: "Base layers",
    openSwitcher: "Open Baselayer-Switcher",
    closeSwitcher: "Close Baselayer-Switcher",
  },
  closeButtonImage = <FaChevronLeft />,
  onCloseButtonClick = null,
  onLayerButtonClick = null,
  onSwitcherButtonClick = null,
  t = (s) => s,
}) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [currentLayer, setCurrentLayer] = useState(
    getVisibleLayer(layers) || layers[0],
  );

  /* Images are loaded from props if provided, fallback from layer */
  const images = layerImages
    ? Object.keys(layerImages).map((layerImage) => {
        return layerImages[layerImage];
      })
    : layers.map((layer) => {
        return layer.get("previewImage");
      });

  const openClass = switcherOpen ? " rs-open" : "";
  const hiddenStyle = switcherOpen && !isClosed ? "visible" : "hidden";

  const handleSwitcherClick = (evt) => {
    const nextLayer = layers.find((layer) => {
      return !layer.visible;
    });
    const onButtonClick =
      layers.length === 2 ? onLayerButtonClick : onSwitcherButtonClick;
    if (onButtonClick) {
      onButtonClick(evt, nextLayer);
    }
    if (layers.length === 2) {
      /* On only two layer options the opener becomes a layer toggle button */
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

  const onLayerSelect = (layer, evt) => {
    if (onLayerButtonClick) {
      onLayerButtonClick(evt, layer);
    }
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

  useEffect(() => {
    // Update the layer selected when a visibility changes.
    const olKeys = (layers || []).map((layer) => {
      return layer.on("change:visible", (evt) => {
        if (evt.target.visible && currentLayer !== evt.target) {
          setCurrentLayer(evt.target);
        }
      });
    });
    return () => {
      unByKey(olKeys);
    };
  }, [currentLayer, layers]);

  if (!layers || layers.length < 2 || !currentLayer) {
    return null;
  }

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
        const activeClass = layerName === currentLayer.name ? " rs-active" : "";
        const imageStyle = getImageStyle(
          layerImages ? layerImages[`${layer.key}`] : layer.get("previewImage"),
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
              onClick={(evt) => {
                return onLayerSelect(layer, evt);
              }}
              onKeyPress={(evt) => {
                if (evt.which === 13) {
                  onLayerSelect(layer, evt);
                }
              }}
              style={imageStyle}
              tabIndex={switcherOpen ? "0" : "-1"}
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
      <CloseButton
        onClick={(evt) => {
          if (onCloseButtonClick) {
            onCloseButtonClick(evt);
          }
          setSwitcherOpen(false);
        }}
        tabIndex={switcherOpen ? "0" : "-1"}
        title={titles.closeSwitcher}
      >
        {closeButtonImage}
      </CloseButton>
    </div>
  );
}

BaseLayerSwitcher.propTypes = propTypes;

export default BaseLayerSwitcher;
