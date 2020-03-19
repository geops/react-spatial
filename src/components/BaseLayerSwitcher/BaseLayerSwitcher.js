import React, { useState } from 'react';
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

function BaseLayerSwitcher({ layers, className, titles }) {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  if (!layers || layers.length < 2) {
    return null;
  }

  const toggleBtn =
    layers.length > 0 ? (
      <div
        className="rs-base-layer-toggle"
        role="button"
        onClick={() => setSwitcherOpen(false)}
        onKeyPress={e => e.which === 13 && setSwitcherOpen(false)}
        tabIndex="0"
        aria-label={titles.closeSwitcher}
        title={titles.closeSwitcher}
      >
        <FaChevronLeft focusable={false} />
      </div>
    ) : null;

  return (
    <div className={`${className}${switcherOpen ? ' open' : ''}`}>
      {switcherOpen ? toggleBtn : null}
      {switcherOpen ? (
        layers.map((layer, index) => {
          const layerName = layers[index].getName();
          return (
            <div
              className="rs-base-layer-switch-button"
              role="button"
              title={layerName}
              aria-label={layerName}
              onClick={() => layers[index].setVisible(true)}
              onKeyPress={e => e.which === 13 && layers[index].setVisible(true)}
              tabIndex={index}
            >
              <div className="rs-base-layer-switch-title">{layerName}</div>
              {/* <img
                src={fallbackImg}
                alt={fallbackImg}
                style={{ opacity: fallbackImgOpacity }}
                className="rs-base-layer-image"
              /> */}
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
        />
      )}
    </div>
  );
}

BaseLayerSwitcher.propTypes = propTypes;
BaseLayerSwitcher.defaultProps = defaultProps;

export default BaseLayerSwitcher;
