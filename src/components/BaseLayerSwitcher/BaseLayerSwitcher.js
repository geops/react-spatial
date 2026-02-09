import Layer from "ol/layer/Layer";
import { unByKey } from "ol/Observable";
import PropTypes from "prop-types";
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

const propTypes = {
  /**
   * CSS class to apply on the container.
   */
  className: PropTypes.string,

  /**
   * Image (node) rendered in the switcher close button.
   */
  closeButtonImage: PropTypes.node,

  /**
   * Function that returns the alternative text if the layer's image is not found.
   */
  getAltText: PropTypes.func,

  /**
   * Function that returns the label to display att the bootm of the layer's image and as title attribute.
   */
  getLayerLabel: PropTypes.func,

  /**
   * Object containing relative paths to the base layer images. Object
   * keys need to correspond to layer keys
   */
  layerImages: PropTypes.objectOf(PropTypes.string),

  /**
   * An array of [mobility-toolbox-js layers](https://mobility-toolbox-js.geops.io/api/identifiers%20html#ol-layers).
   */
  layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,

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

  /**
   * Button titles.
   */
  titles: PropTypes.shape({
    button: PropTypes.string,
    closeSwitcher: PropTypes.string,
    openSwitcher: PropTypes.string,
  }),
};

const getVisibleLayer = (layers) => {
  return layers.find((layer) => {
    return layer.getVisible ? layer.getVisible() : layer.visible;
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
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }
    : null;
};

function CloseButton({ children, onClick, tabIndex, title }) {
  return (
    <div
      aria-label={title}
      className="rs-base-layer-switcher-close-btn"
      onClick={onClick}
      onKeyPress={(e) => {
        return e.which === 13 && onClick();
      }}
      role="button"
      tabIndex={tabIndex}
      title={title}
    >
      {children}
    </div>
  );
}

CloseButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  tabIndex: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const defaultTitles = {
  button: "Base layers",
  closeSwitcher: "Close Baselayer-Switcher",
  openSwitcher: "Open Baselayer-Switcher",
};

const getDefaultLabel = (layer) => {
  return layer?.get("name") || "";
};

const getDefaultAltText = () => {
  return "Source not found";
};

/**
 * The BaseLayerSwitcher component renders a button interface for switching the visible
 * when defined as base layer.
 */

function BaseLayerSwitcher({
  className = "rs-base-layer-switcher",
  closeButtonImage = <FaChevronLeft />,
  getAltText = getDefaultAltText,
  getLayerLabel = getDefaultLabel,
  layerImages,
  layers,
  onCloseButtonClick,
  onLayerButtonClick,
  onSwitcherButtonClick,
  titles = defaultTitles,
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
      return !(layer.getVisible ? layer.getVisible() : layer.visible);
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
        const vis = evt.target.getVisible
          ? evt.target.getVisible()
          : evt.target.visible;
        if (vis && currentLayer !== evt.target) {
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

  const firstNonVisibleLayer = layers.find((layer) => {
    return !(layer.getVisible ? layer.getVisible() : layer.visible);
  });

  return (
    <div className={`${className}${openClass}`}>
      <div
        aria-label={titles.openSwitcher}
        className={`rs-base-layer-switcher-button rs-opener${openClass}`}
        onClick={handleSwitcherClick}
        onKeyPress={(e) => {
          if (e.which === 13) {
            handleSwitcherClick();
          }
        }}
        role="button"
        style={getImageStyle(nextImage)}
        tabIndex="0"
        title={titles.openSwitcher}
      >
        <div className="rs-base-layer-switcher-title">
          {layers.length !== 2
            ? titles.button
            : firstNonVisibleLayer && getLayerLabel(firstNonVisibleLayer)}
        </div>
        {nextImage ? null : (
          <span className="rs-alt-text">
            {getAltText(firstNonVisibleLayer)}
          </span>
        )}
      </div>
      {layers.map((layer, idx) => {
        const layerName = getLayerLabel(layer);
        const activeClass =
          layerName === currentLayer.get("name") ? " rs-active" : "";
        const imageStyle = getImageStyle(
          layerImages
            ? layerImages[`${layer.get("key") || layer.key}`]
            : layer.get("previewImage"),
        );
        return (
          <div
            className="rs-base-layer-switcher-btn-wrapper"
            key={layer.key}
            style={{
              /* stylelint-disable-next-line value-keyword-case */
              overflow: hiddenStyle,
              /* stylelint-disable-next-line value-keyword-case */
              zIndex: layers.length - idx,
            }}
          >
            <div
              aria-label={layerName}
              className={`rs-base-layer-switcher-button${openClass}`}
              onClick={(evt) => {
                return onLayerSelect(layer, evt);
              }}
              onKeyPress={(evt) => {
                if (evt.which === 13) {
                  onLayerSelect(layer, evt);
                }
              }}
              role="button"
              style={imageStyle}
              tabIndex={switcherOpen ? "0" : "-1"}
              title={layerName}
            >
              <div className={`rs-base-layer-switcher-title${activeClass}`}>
                {layerName}
              </div>
              {imageStyle ? null : (
                <span className="rs-alt-text">{getAltText(layer)}</span>
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
