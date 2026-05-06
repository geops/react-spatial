/* eslint-disable no-param-reassign */
import { getBottomRight, getTopLeft } from "ol/extent";
import React, { useCallback } from "react";

import NorthArrowSimple from "../../images/northArrow.url.svg";
import NorthArrowCircle from "../../images/northArrowCircle.url.svg";

import type OLMap from "ol/Map";

export interface ExtraDataImg {
  circled?: boolean;
  height?: number;
  rotation?: (() => number) | number;
  src?: string;
  width?: number;
}

export interface ExtraDataCopyright {
  background?: boolean | Record<string, any>;
  fillStyle?: CanvasPattern | string;
  font?: string;
  maxWidth?: number;
  paddingBackground?: number;
  paddingBottom?: number;
  text?: (() => string) | string;
}

export interface ExtraData {
  copyright?: ExtraDataCopyright;
  logo?: ExtraDataImg;
  northArrow?: ExtraDataImg;
  qrCode?: ExtraDataImg;
}

export interface CanvasSaveButtonProps {
  /**
   * Automatically download the image saved.
   */
  autoDownload?: boolean;
  /**
   * Children content of the button.
   */
  children?: React.ReactNode;
  /**
   * Array of 4 [ol/Coordinate](https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~Coordinate).
   * If no coordinates and no extent are given, the whole map is exported.
   * This property must be used to export rotated map.
   * If you don't need to export rotated map the extent property can be used as well.
   * If extent is specified, coordinates property is ignored.
   */
  coordinates?: number[][];
  /**
   * Extent for the export. If no extent is given, the whole map is exported.
   */
  extent?: number[];
  /**
   * Extra data, such as copyright, north arrow configuration.
   * All extra data is optional.
   *
   * Example 1:
   *
    {
      copyright: {
        text: 'Example copyright', // Copyright text or function
        font: '10px Arial', // Font, default is '12px Arial'
        fillStyle: 'blue', // Fill style, default is 'black'
      },
      northArrow,  // True if the north arrow
                   // should be placed with default configuration
                   // (default image, rotation=0, circled=false)
    }
   * Example 2:
   *
    {
      northArrow: {
        src: NorthArrowCustom,
        width: 60, // Width in px, default is 80
        height: 100, // Height in px, default is 80
        rotation: 25, // Absolute rotation in degrees as number or function

      }
    }
   * Example 3:
   *
    {
      copyright: {
        text: () => { // Copyright as function
          return this.copyright;
        },
      },
      northArrow: {
        rotation: () => { // Rotation as function
          return NorthArrow.radToDeg(this.map.getView().getRotation());
        },
        circled, // Display circle around the north arrow (Does not work for custom src)
      },
    }
   */
  extraData?: ExtraData;
  /**
   * Output format of the image.
   */
  format?: "image/jpeg" | "image/png";
  /**
   * Return the file name of the image to download.
   */
  getDownloadImageName?: (format: string) => string;
  /** An  [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html). */
  map?: OLMap;
  /**
   * Space (in pixels) between the border of the canvas and the elements.
   * Default to 1% of the canvas width.
   */
  margin?: number;
  /**
   * Function called after the dowload process ends.
   *
   * @param {object} error Error message the process fails.
   */
  onSaveEnd?: (...args: unknown[]) => void;
  /**
   * Function called before the dowload process begins.
   */
  onSaveStart?: (map: OLMap) => Promise<OLMap>;
  /**
   * Space (in pixels) between elements.
   * Default to 5px.
   */
  padding?: number;
  /**
   * Scale the map for better quality. Possible values: 1, 2 or 3.
   * WARNING: The tiled layer with a WMTS or XYZ source must provides an url
   * for each scale in the config file.
   */
  scale?: number;
}

const getMargin = (destCanvas: HTMLCanvasElement) => {
  const newMargin = destCanvas.width / 100; // 1% of the canvas width
  return newMargin;
};

const getDefaultDownloadImageName = (format: string) => {
  const fileExt = format === "image/jpeg" ? "jpg" : "png";
  return `${window.document.title.replace(/ /g, "_").toLowerCase()}.${fileExt}`;
};

let multilineCopyright = false;
let copyrightY = 0;

// Ensure the font size fita with the image width.
const decreaseFontSize = (
  destContext: CanvasRenderingContext2D,
  maxWidth: number,
  copyright: string,
  scale: number,
) => {
  const minFontSize = 8;
  let sizeMatch;
  let fontSize;
  do {
    sizeMatch = /[0-9]+(?:\.[0-9]+)?(px)/i.exec(destContext.font);
    fontSize = parseInt(sizeMatch[0].replace(sizeMatch[1], ""), 10);

    destContext.font = destContext.font.replace(
      String(fontSize),
      String(fontSize - 1),
    );

    multilineCopyright = false;

    if (fontSize - 1 === minFontSize) {
      multilineCopyright = true;
    }
  } while (
    fontSize - 1 > minFontSize &&
    destContext.measureText(copyright).width * scale > maxWidth
  );

  return destContext.font;
};

const drawTextBackground = (
  destContext: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  styleOptions: unknown = {},
) => {
  destContext.save();
  // Dflt is a white background
  destContext.fillStyle = "rgba(255,255,255,.8)";

  // To simplify usability the user could pass a boolean to use only default values.
  if (typeof styleOptions === "object") {
    Object.entries(styleOptions).forEach(([key, value]) => {
      destContext[key] = value;
    });
  }

  /// draw background rect assuming height of font
  destContext.fillRect(x, y, width, height);
  destContext.restore();
};

const drawCopyright = (
  destContext: CanvasRenderingContext2D,
  destCanvas: HTMLCanvasElement,
  maxWidth: number,
  extraData: ExtraData,
  scale: number,
  margin: number,
  padding: number,
) => {
  const { background, fillStyle, font, text } = extraData.copyright;
  const { paddingBackground = 2, paddingBottom = padding } =
    extraData.copyright;

  let copyright = typeof text === "function" ? text() : text?.trim();

  if (Array.isArray(copyright)) {
    copyright = copyright.join();
  }

  destContext.save();
  destContext.scale(scale, scale);
  destContext.font = font || "12px Arial";
  destContext.font = decreaseFontSize(destContext, maxWidth, copyright, scale);
  destContext.textBaseline = "bottom";
  destContext.scale(scale, scale);
  destContext.fillStyle = fillStyle || "black";

  // We search if the display on 2 line is necessary
  let firstLine = copyright;
  let firstLineMetrics = destContext.measureText(firstLine);

  // If the text is bigger than the max width we split it into 2 lines
  if (multilineCopyright) {
    const wordNumber = copyright.split(" ").length;
    for (let i = 0; i < wordNumber; i += 1) {
      // Stop removing word when fits within one line.
      if (firstLineMetrics.width * scale < maxWidth) {
        break;
      }
      firstLine = firstLine.substring(0, firstLine.lastIndexOf(" "));
      firstLineMetrics = destContext.measureText(firstLine);
    }
  }

  // Define second line if necessary
  const secondLine = copyright.replace(firstLine, "").trim();

  // At this point we the number of lines to display.
  const lines = [firstLine, secondLine]
    .filter((l) => {
      return !!l;
    })
    .reverse();

  // We draw from bottom to top because textBaseline is 'bottom
  let lineX = margin;
  let lineY = destCanvas.height - paddingBottom; // we apply the margin only on the left side

  lines.forEach((line) => {
    const { fontBoundingBoxAscent, fontBoundingBoxDescent, width } =
      destContext.measureText(line);
    const height = fontBoundingBoxAscent + fontBoundingBoxDescent; // we include paddingBackground to have a bit of distance between lines
    let lineTop = lineY - height;

    if (background) {
      const backgroundX = margin;
      lineTop -= paddingBackground * 2;
      drawTextBackground(
        destContext,
        backgroundX,
        lineTop,
        width + paddingBackground * 2,
        height + paddingBackground * 2,
        background,
      );
      lineX += paddingBackground;
      lineY -= paddingBackground;
    }

    destContext.fillText(line, lineX, lineY);
    lineY = lineTop;
  });

  copyrightY = lineY;
  destContext.restore();
};

const drawElement = (
  data: {
    height?: number;
    rotation?: (() => number) | number;
    src?: string;
    width?: number;
  },
  destCanvas: HTMLCanvasElement,
  scale: number,
  margin: number,
  padding: number,
  previousItemSize: number[] = [0, 0],
  side = "right",
) => {
  const destContext = destCanvas.getContext("2d");
  const { height, rotation, src, width } = data;

  return new Promise<number[] | undefined>((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => {
      destContext.save();
      const elementWidth = (width || 80) * scale;
      const elementHeight = (height || 80) * scale;
      const left =
        side === "left"
          ? margin + elementWidth / 2
          : destCanvas.width - margin - elementWidth / 2;
      const top =
        (side === "left" && copyrightY
          ? copyrightY - padding
          : destCanvas.height) -
        margin -
        elementHeight / 2 -
        previousItemSize[1];

      destContext.translate(left, top);

      if (rotation) {
        const angle = typeof rotation === "function" ? rotation() : rotation;
        destContext.rotate(angle * (Math.PI / 180));
      }

      destContext.drawImage(
        img,
        -elementWidth / 2,
        -elementHeight / 2,
        elementWidth,
        elementHeight,
      );
      destContext.restore();

      // Return the pixels width of the arrow and the margin right,
      // that must not be occupied by the copyright.
      resolve([elementWidth + 2 * padding, elementHeight + 2 * padding]);
    };

    img.onerror = () => {
      resolve(undefined);
    };
  });
};

const calculatePixelsToExport = (
  mapToExport: OLMap,
  extent: number[],
  coordinates: number[][],
) => {
  let firstCoordinate;
  let oppositeCoordinate;

  if (extent) {
    firstCoordinate = getTopLeft(extent);
    oppositeCoordinate = getBottomRight(extent);
  } else if (coordinates) {
    // In case of coordinates coming from DragBox interaction:
    //   firstCoordinate is the first coordinate drawn by the user.
    //   oppositeCoordinate is the coordinate of the point dragged by the user.
    [firstCoordinate, , oppositeCoordinate] = coordinates;
  }

  if (firstCoordinate && oppositeCoordinate) {
    const firstPixel = mapToExport.getPixelFromCoordinate(firstCoordinate);
    const oppositePixel =
      mapToExport.getPixelFromCoordinate(oppositeCoordinate);
    const pixelTopLeft = [
      firstPixel[0] <= oppositePixel[0] ? firstPixel[0] : oppositePixel[0],
      firstPixel[1] <= oppositePixel[1] ? firstPixel[1] : oppositePixel[1],
    ];
    const pixelBottomRight = [
      firstPixel[0] > oppositePixel[0] ? firstPixel[0] : oppositePixel[0],
      firstPixel[1] > oppositePixel[1] ? firstPixel[1] : oppositePixel[1],
    ];

    return {
      h: pixelBottomRight[1] - pixelTopLeft[1],
      w: pixelBottomRight[0] - pixelTopLeft[0],
      x: pixelTopLeft[0],
      y: pixelTopLeft[1],
    };
  }
  return null;
};

const createCanvasImage = (
  mapToExport: OLMap,
  extraData: ExtraData,
  scale: number,
  extent: number[],
  coordinates: number[][],
  margin: number,
  padding: number,
) => {
  return new Promise((resolve) => {
    mapToExport.once("rendercomplete", () => {
      // Find all layer canvases and add it to dest canvas.
      const canvases = mapToExport
        .getTargetElement()
        .getElementsByTagName("canvas");

      // Create the canvas to export with the good size.
      let destCanvas;
      let destContext;

      // canvases is an HTMLCollection, we don't try to transform to array because some compilers like cra doesn't translate it right.
      for (let i = 0; i < canvases.length; i += 1) {
        const canvas = canvases[i];
        if (!canvas.width || !canvas.height) {
          continue;
        }
        const clip = calculatePixelsToExport(
          mapToExport,
          extent,
          coordinates,
        ) || {
          h: canvas.height,
          w: canvas.width,
          x: 0,
          y: 0,
        };

        if (!destCanvas) {
          destCanvas = document.createElement("canvas");
          destCanvas.width = clip.w;
          destCanvas.height = clip.h;
          destContext = destCanvas.getContext("2d");
        }

        // Draw canvas to the canvas to export.
        destContext.drawImage(
          canvas,
          clip.x,
          clip.y,
          clip.w,
          clip.h,
          0,
          0,
          destCanvas.width,
          destCanvas.height,
        );
      }

      margin = margin || getMargin(destCanvas);

      // Custom info
      let logoPromise: Promise<number[] | undefined> =
        Promise.resolve(undefined);
      if (destContext && extraData?.logo) {
        logoPromise = drawElement(
          extraData.logo,
          destCanvas,
          scale,
          margin,
          padding,
        );
      }

      logoPromise.then((logoSize = [0, 0]) => {
        // North arrow
        let arrowPromise: Promise<number[] | undefined> =
          Promise.resolve(undefined);
        if (destContext && extraData?.northArrow) {
          arrowPromise = drawElement(
            {
              src: extraData.northArrow.circled
                ? NorthArrowCircle
                : NorthArrowSimple,
              ...extraData.northArrow,
            },
            destCanvas,
            scale,
            margin,
            padding,
            logoSize,
          );
        }

        // Copyright
        arrowPromise.then((arrowSize = [0, 0]) => {
          const widestElement = Math.max(logoSize[0], arrowSize[0]);
          if (destContext && extraData?.copyright?.text) {
            const maxWidth =
              extraData.copyright.maxWidth ||
              (widestElement
                ? destContext.canvas.width - widestElement - margin
                : destContext.canvas.width);
            drawCopyright(
              destContext,
              destCanvas,
              maxWidth,
              extraData,
              scale,
              margin,
              padding,
            );
          }
          let qrCodePromise: Promise<number[] | undefined> =
            Promise.resolve(undefined);
          if (destContext && extraData?.qrCode) {
            qrCodePromise = drawElement(
              extraData.qrCode,
              destCanvas,
              scale,
              margin,
              padding,
              undefined,
              "left",
            );
          }
          qrCodePromise.then(() => {
            return resolve(destCanvas);
          });
        });
      });
    });
    mapToExport.renderSync();
  });
};

const downloadCanvasImage = (
  canvas: HTMLCanvasElement,
  format: string,
  getDownloadImageName: (format: string) => string,
) => {
  // Use blob for large images
  const promise = new Promise((resolve) => {
    if (/msie (9|10)/gi.test(window.navigator.userAgent.toLowerCase())) {
      // ie 9 and 10
      const url = canvas.toDataURL(format);
      const w = window.open("about:blank", "");
      w.document.write(`<img src="${url}" alt="from canvas"/>`);
      resolve(url);
    }
    if (
      (
        window.navigator as unknown as {
          msSaveBlob?: (blob: Blob, filename: string) => void;
        }
      ).msSaveBlob
    ) {
      // ie 11 and higher
      let image;
      try {
        image = (canvas as unknown as { msToBlob: () => Blob }).msToBlob();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
      const blob = new Blob([image], {
        type: format,
      });
      resolve(blob);
      (
        window.navigator as unknown as {
          msSaveBlob?: (blob: Blob, filename: string) => void;
        }
      ).msSaveBlob(blob, getDownloadImageName(format));
    } else {
      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.download = getDownloadImageName(format);
        link.href = URL.createObjectURL(blob);
        // append child to document for firefox to be able to download.
        document.body.appendChild(link);
        link.click();
        resolve(blob);
      }, format);
    }
  });
  return promise;
};

/**
 * The CanvasSaveButton component creates a button to save
 * an [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)
 * canvas as an image.
 */
function CanvasSaveButton({
  autoDownload = true,
  children = null,
  coordinates = null,
  extent = null,
  extraData = null,
  format = "image/png",
  getDownloadImageName = getDefaultDownloadImageName,
  map = null,
  margin = null,
  onSaveEnd = () => {},
  onSaveStart = (mapp) => {
    return Promise.resolve(mapp);
  },
  padding = 5,
  scale = 1,
}: CanvasSaveButtonProps) {
  const onClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (evt) => {
      if (
        (
          window.navigator as unknown as {
            msSaveBlob?: (blob: Blob, filename: string) => void;
          }
        ).msSaveBlob
      ) {
        // ie only
        evt.preventDefault();
        evt.stopPropagation();
      }
      multilineCopyright = false;
      copyrightY = 0;
      onSaveStart(map).then((mapToExport) => {
        return createCanvasImage(
          mapToExport || map,
          extraData,
          scale,
          extent,
          coordinates,
          margin,
          padding,
        )
          .then((canvas: unknown) => {
            if (autoDownload) {
              downloadCanvasImage(canvas, format, getDownloadImageName).then(
                (blob) => {
                  onSaveEnd(mapToExport, canvas, blob);
                },
              );
            } else {
              onSaveEnd(mapToExport, canvas);
            }
          })
          .catch((err) => {
            if (err) {
              // eslint-disable-next-line no-console
              console.error(err);
            }
            onSaveEnd(mapToExport, err);
          });
      });
    },
    [
      autoDownload,
      coordinates,
      extent,
      extraData,
      format,
      map,
      margin,
      onSaveEnd,
      onSaveStart,
      padding,
      scale,
      getDownloadImageName,
    ],
  );

  return (
    <>
      {React.Children.map(children, (child) => {
        return React.cloneElement(
          child as React.ReactElement<{
            onClick: React.MouseEventHandler<HTMLButtonElement>;
          }>,
          {
            onClick,
          },
        );
      })}
    </>
  );
}

export default CanvasSaveButton;
