import { Resizable } from "re-resizable";
import { useState } from "react";

import ResizeHandler from "../ResizeHandler";

import type { Component } from "react";
import type React from "react";

export interface MobileSize {
  defaultSize?: {
    height?: number | string;
    width?: number | string;
  };
  maximalHeight?: number | string;
  minimalHeight?: number | string;
  size?: {
    height?: number | string;
    width?: number | string;
  };
}

export interface OverlayProps {
  /**
   * Children content of the overlay.
   */
  children?: React.ReactNode;
  /**
   * CSS class added to container.
   */
  className?: string;
  /**
   * Deactivate the ability to resize the overlay on mobile.
   * /!\  This prop is only used if isMobile (observer width < 768px).
   */
  isMobileResizable?: boolean;
  /**
   * Size parameters to the Resizable component on mobile.
   * Pass following prop to re-resizable component: 'size', 'defaultSize', 'minHeight' & 'maxHeight'
   * (https://github.com/bokuweb/re-resizable)
   * /!\  This prop is only used if isMobile (observer width < 768px).
   */
  mobileSize?: MobileSize;
  /**
   * Observed element to define screen size.
   */
  observe?: Component | React.ReactNode | React.RefObject<unknown> | string;
  /**
   * Callback when start resizing
   * Pass following prop to re-resizable component
   * (https://github.com/bokuweb/re-resizable)
   */
  onResizeStart?: (...args: unknown[]) => void;
  /**
   * Callback when stop resizing
   * Pass following prop to re-resizable component
   * (https://github.com/bokuweb/re-resizable)
   */
  onResizeStop?: (...args: unknown[]) => void;
  /**
   * Minimal width to consider the observed as mobile.
   * Default is 768px.
   */
  thresholdWidthForMobile?: number;
}

const defaultMobileSize: MobileSize = {
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
}: OverlayProps) {
  const [isMobile, setIsMobile] = useState<boolean>();

  const onResize = (entries: unknown[]) => {
    for (let i = 0; i < entries.length; i += 1) {
      const { width } = entries[i].contentRect;
      setIsMobile(width <= thresholdWidthForMobile);
    }
  };

  let resizableMobileSize: MobileSize;
  if (mobileSize) {
    resizableMobileSize = { ...defaultMobileSize, ...mobileSize };
  }

  return (
    <>
      {observe ? (
        <ResizeHandler observe={observe as any} onResize={onResize} />
      ) : null}
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

export default Overlay;
