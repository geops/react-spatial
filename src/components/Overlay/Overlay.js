import PropTypes from "prop-types";
import { Resizable } from "re-resizable";
import React, { Component, useState } from "react";

import ResizeHandler from "../ResizeHandler";

const propTypes = {
  /**
   * Children content of the overlay.
   */
  children: PropTypes.node,

  /**
   * CSS class added to container.
   */
  className: PropTypes.string,

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
    defaultSize: PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    maximalHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minimalHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    size: PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }),

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
   * Callback when start resizing
   * Pass following prop to re-resizable component
   * (https://github.com/bokuweb/re-resizable)
   */
  onResizeStart: PropTypes.func,

  /**
   * Callback when stop resizing
   * Pass following prop to re-resizable component
   * (https://github.com/bokuweb/re-resizable)
   */
  onResizeStop: PropTypes.func,

  /**
   * Minimal width to consider the observed as mobile.
   * Default is 768px.
   */
  thresholdWidthForMobile: PropTypes.number,
};

const defaultMobileSize = {
  defaultSize: {
    height: "25%",
    width: "100%",
  },
  maximalHeight: "100%",
  minimalHeight: "25%",
  size: undefined,
};

const emptyFunc = () => {};
/**
 * The Overlay component creates a resizable, swipable overlay <div\>
 */
function Overlay({
  children = null,
  className = null,
  isMobileResizable = true,
  mobileSize = defaultMobileSize,
  observe = null,
  onResizeStart = emptyFunc,
  onResizeStop = emptyFunc,
  thresholdWidthForMobile = 768,
}) {
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
          className={`tm-overlay-mobile${className ? ` ${className}` : ""}`}
          defaultSize={mobileSize && resizableMobileSize.defaultSize}
          enable={{
            bottom: false,
            bottomLeft: false,
            bottomRight: false,
            left: false,
            right: false,
            top: isMobileResizable,
            topLeft: false,
            topRight: false,
          }}
          handleComponent={{
            top: <div className="tm-overlay-handler">&mdash;</div>,
          }}
          handleStyles={{
            top: {
              alignItems: "center",
              display: "flex",
              height: "20px",
              justifyContent: "center",
              padding: "20px 0",
              top: "-20px",
              width: "100%",
            },
          }}
          maxHeight={mobileSize && resizableMobileSize.maximalHeight}
          minHeight={mobileSize && resizableMobileSize.minimalHeight}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          size={resizableMobileSize.size}
          style={{
            position: "absolute",
          }}
        >
          <div className="tm-overlay-mobile-content">{children}</div>
        </Resizable>
      ) : (
        <div className={`tm-overlay${className ? ` ${className}` : ""}`}>
          {children}
        </div>
      )}
    </>
  );
}

Overlay.propTypes = propTypes;

export default Overlay;
