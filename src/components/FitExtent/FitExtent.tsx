import type OLMap from "ol/Map";
import type React from "react";

export interface FitExtentProps {
  [key: string]: unknown;
  /**
   * Button content.
   */
  children: React.ReactNode;
  /**
   * CSS class  for the fitExtent button.
   */
  className?: string;
  /**
   * The extent to be zoomed.
   */
  extent: number[];
  /**
   * An [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
   */
  map: OLMap;
}

/**
 * The FitExtent component creates a button that updates the current extent of
 * an [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html).
 */
function FitExtent({
  children,
  className = "rs-fit-extent",
  extent,
  map,
  ...other
}: FitExtentProps) {
  const fit = (evt: unknown) => {
    if (evt.which && evt.which !== 13) {
      return;
    }
    map.getView().cancelAnimations();
    map.getView().fit(extent, { size: map.getSize() });
  };

  return (
    <div
      className={className}
      onClick={fit}
      onKeyPress={fit}
      role="button"
      tabIndex={0}
      {...other}
    >
      {children}
    </div>
  );
}

export default FitExtent;
