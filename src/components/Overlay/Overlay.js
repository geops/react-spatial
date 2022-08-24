import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { Resizable } from 're-resizable';
import ResizeHandler from '../ResizeHandler';

const propTypes = {
  /**
   * CSS class added to container.
   */
  className: PropTypes.string,

  /**
   * Children content of the overlay.
   */
  children: PropTypes.node,

  /**
   * Observed element to define screen size.
   */
  observe: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.instanceOf(Component),
    PropTypes.shape({ current: PropTypes.node }),
    PropTypes.shape({ current: PropTypes.instanceOf(Component) }),
  ]),

  /**
   * Deactivate the ability to resize the overlay on mobile.
   * /!\ This prop is only used if isMobile (observer width < 768px).
   */
  isMobileResizable: PropTypes.bool,

  /**
   * Size parameters to the Resizable component on mobile.
   * Pass following prop to re-resizable component: 'size', 'defaultSize', 'minHeight' & 'maxHeight'
   * (https://github.com/bokuweb/re-resizable)
   * /!\ This prop is only used if isMobile (observer width < 768px).
   */
  mobileSize: PropTypes.shape({
    minimalHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maximalHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultSize: PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    size: PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }),

  /**
   * Minimal width to consider the observed as mobile.
   * Default is 768px.
   */
  thresholdWidthForMobile: PropTypes.number,

  /**
   * Callback when stop resizing
   * Pass following prop to re-resizable component
   * (https://github.com/bokuweb/re-resizable)
   */
  onResizeStop: PropTypes.func,

  /**
   * Callback when start resizing
   * Pass following prop to re-resizable component
   * (https://github.com/bokuweb/re-resizable)
   */
  onResizeStart: PropTypes.func,
};

const defaultMobileSize = {
  defaultSize: {
    width: '100%',
    height: '25%',
  },
  size: undefined,
  maximalHeight: '100%',
  minimalHeight: '25%',
};

const defaultProps = {
  className: null,
  children: null,
  observe: null,
  isMobileResizable: true,
  mobileSize: defaultMobileSize,
  thresholdWidthForMobile: 768,
  onResizeStop: () => {},
  onResizeStart: () => {},
};

/**
 * The Overlay component creates a resizable, swipable overlay <div\>
 */
const Overlay = ({
  observe,
  className,
  children,
  isMobileResizable,
  mobileSize,
  onResizeStop,
  onResizeStart,
  thresholdWidthForMobile,
}) => {
  const [isMobile, setIsMobile] = useState();

  const onResize = (entries) => {
    for (let i = 0; i < entries.length; i += 1) {
      const { width } = entries[i].contentRect;
      setIsMobile(width <= thresholdWidthForMobile);
    }
  };

  let resizableMobileSize;
  if (mobileSize) {
    resizableMobileSize = { ...defaultMobileSize, ...mobileSize };
  }

  return (
    <>
      {observe ? <ResizeHandler observe={observe} onResize={onResize} /> : null}
      {isMobile ? (
        <Resizable
          style={{
            position: 'absolute',
          }}
          enable={{
            top: isMobileResizable,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          maxHeight={mobileSize && resizableMobileSize.maximalHeight}
          minHeight={mobileSize && resizableMobileSize.minimalHeight}
          handleComponent={{
            top: <div className="tm-overlay-handler">&mdash;</div>,
          }}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          handleStyles={{
            top: {
              top: '-20px',
              height: '20px',
              padding: '20px 0',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
          size={resizableMobileSize.size}
          defaultSize={mobileSize && resizableMobileSize.defaultSize}
          className={`tm-overlay-mobile${className ? ` ${className}` : ''}`}
        >
          <div className="tm-overlay-mobile-content">{children}</div>
        </Resizable>
      ) : (
        <div className={`tm-overlay${className ? ` ${className}` : ''}`}>
          {children}
        </div>
      )}
    </>
  );
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;
