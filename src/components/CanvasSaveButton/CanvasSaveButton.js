/* eslint-disable no-param-reassign */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import OLMap from "ol/Map";
import { getTopLeft, getBottomRight } from "ol/extent";
import NorthArrowSimple from "../../images/northArrow.url.svg";
import NorthArrowCircle from "../../images/northArrowCircle.url.svg";

const extraDataImgPropType = PropTypes.shape({
  src: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  rotation: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  circled: PropTypes.bool,
});

// support server-side rendering where `Element` will not be defined
const CanvasPatternType =
  typeof CanvasPattern === "undefined" ? Function : CanvasPattern;

const propTypes = {
  /**
   * Automatically download the image saved.
   */
  autoDownload: PropTypes.bool,

  /**
   * Children content of the button.
   */
  children: PropTypes.node,

  /**
   * Output format of the image.
   */
  format: PropTypes.oneOf(["image/jpeg", "image/png"]),

  /** An  [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html). */
  map: PropTypes.instanceOf(OLMap),

  /**
   * Extent for the export. If no extent is given, the whole map is exported.
   */
  extent: PropTypes.arrayOf(PropTypes.number),

  /**
   * Array of 4 [ol/Coordinate](https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~Coordinate).
   * If no coordinates and no extent are given, the whole map is exported.
   * This property must be used to export rotated map.
   * If you don't need to export rotated map the extent property can be used as well.
   * If extent is specified, coordinates property is ignored.
   */
  coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),

  /**
   * Scale the map for better quality. Possible values: 1, 2 or 3.
   * WARNING: The tiled layer with a WMTS or XYZ source must provides an url
   * for each scale in the config file.
   */
  scale: PropTypes.number,

  /**
   * Function called before the dowload process begins.
   */
  onSaveStart: PropTypes.func,

  /**
   * Function called after the dowload process ends.
   *
   * @param {object} error Error message the process fails.
   */
  onSaveEnd: PropTypes.func,

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
  extraData: PropTypes.shape({
    logo: extraDataImgPropType,
    northArrow: extraDataImgPropType,
    qrCode: extraDataImgPropType,
    copyright: PropTypes.shape({
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      font: PropTypes.string,
      fillStyle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(CanvasPatternType),
      ]),
      background: PropTypes.bool,
      maxWidth: PropTypes.number,
    }),
  }),
};

const defaultProps = {
  autoDownload: true,
  children: null,
  map: null,
  format: "image/png",
  extraData: null,
  extent: null,
  coordinates: null,
  scale: 1,
  onSaveStart: (map) => {
    return Promise.resolve(map);
  },
  onSaveEnd: () => {},
};

/**
 * The CanvasSaveButton component creates a button to save
 * an [ol/map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)
 * canvas as an image.
 */
class CanvasSaveButton extends PureComponent {
  constructor(props) {
    super(props);
    this.padding = 5;
  }

  static getMargin(destCanvas) {
    const newMargin = destCanvas.width / 100; // 1% of the canvas width
    return newMargin;
  }

  onClick(evt) {
    const { map, onSaveStart, onSaveEnd, autoDownload } = this.props;
    if (window.navigator.msSaveBlob) {
      // ie only
      evt.preventDefault();
      evt.stopPropagation();
    }
    onSaveStart(map).then((mapToExport) => {
      return this.createCanvasImage(mapToExport || map)
        .then((canvas) => {
          if (autoDownload) {
            this.downloadCanvasImage(canvas).then((blob) => {
              onSaveEnd(mapToExport, canvas, blob);
            });
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
  }

  getDownloadImageName() {
    const { format } = this.props;
    const fileExt = format === "image/jpeg" ? "jpg" : "png";
    return (
      `${window.document.title.replace(/ /g, "_").toLowerCase()}` +
      `.${fileExt}`
    );
  }

  // Ensure the font size fita with the image width.
  decreaseFontSize(destContext, maxWidth, copyright, scale) {
    const minFontSize = 8;
    let sizeMatch;
    let fontSize;
    do {
      sizeMatch = destContext.font.match(/[0-9]+(?:\.[0-9]+)?(px)/i);
      fontSize = parseInt(sizeMatch[0].replace(sizeMatch[1], ""), 10);

      // eslint-disable-next-line no-param-reassign
      destContext.font = destContext.font.replace(fontSize, fontSize - 1);

      this.multilineCopyright = null;

      if (fontSize - 1 === minFontSize) {
        this.multilineCopyright = true;
      }
    } while (
      fontSize - 1 > minFontSize &&
      destContext.measureText(copyright).width * scale > maxWidth
    );

    return destContext.font;
  }

  // eslint-disable-next-line class-methods-use-this
  drawTextBackground(
    destContext,
    textMeasure,
    textX,
    textY,
    padding,
    styleOptions = {},
  ) {
    /// get width of text
    const { width, height, actualBoundingBoxAscent } = textMeasure;
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
    destContext.fillRect(
      textX - padding,
      textY - actualBoundingBoxAscent - padding,
      width + padding * 2,
      height + padding * 2,
    );
    destContext.restore();
  }

  drawCopyright(destContext, destCanvas, maxWidth) {
    const { extraData, scale } = this.props;
    const { text, font, fillStyle, background } = extraData.copyright;
    let copyright = typeof text === "function" ? text() : text;

    if (Array.isArray(copyright)) {
      copyright = copyright.join();
    }

    destContext.save();
    destContext.scale(scale, scale);
    destContext.font = font || "12px Arial";
    destContext.font = this.decreaseFontSize(
      destContext,
      maxWidth - this.padding,
      copyright,
      scale,
    );

    destContext.scale(scale, scale);
    destContext.fillStyle = fillStyle || "black";

    // We search if the display on 2 line is necessary
    let firstLine = copyright;
    const wordNumber = copyright.split(" ").length;

    // If the text is bigger than the max width we split it into 2 lines
    if (this.multilineCopyright) {
      for (let i = 0; i < wordNumber; i += 1) {
        firstLine = firstLine.substring(0, firstLine.lastIndexOf(" "));
        // Stop removing word when fits within one line.
        if (
          destContext.measureText(firstLine).width * scale <
          maxWidth - this.padding
        ) {
          break;
        }
      }
    }
    const secondLine = copyright.replace(firstLine, "");

    // Draw first line (line break isn't supported for fillText).
    const textX = this.margin;
    let textMeasure = destContext.measureText(firstLine);
    textMeasure.height =
      textMeasure.actualBoundingBoxAscent +
      textMeasure.actualBoundingBoxDescent;
    let firstLineY = destCanvas.height / scale - this.padding;
    const secondLineY = firstLineY;
    const paddingBetweenLines = 3;
    const paddingBackground = paddingBetweenLines / 2;

    if (secondLine) {
      firstLineY -= textMeasure.height + paddingBetweenLines;
    }
    if (background) {
      this.drawTextBackground(
        destContext,
        textMeasure,
        textX,
        firstLineY,
        paddingBackground,
        background,
      );
    }
    destContext.fillText(firstLine, textX, firstLineY);

    // Draw second line.
    if (secondLine) {
      textMeasure = destContext.measureText(secondLine);
      textMeasure.height =
        textMeasure.actualBoundingBoxAscent +
        textMeasure.actualBoundingBoxDescent;
      if (background) {
        this.drawTextBackground(
          destContext,
          textMeasure,
          textX,
          secondLineY,
          paddingBackground,
          background,
        );
      }
      destContext.fillText(secondLine, textX, secondLineY);
    }

    const firstLineMetrics = destContext.measureText(firstLine);
    const secondLineMetrics = destContext.measureText(secondLine);
    const heightFirstLine =
      firstLineMetrics.actualBoundingBoxAscent +
      firstLineMetrics.actualBoundingBoxDescent;
    const heightSecondLine =
      secondLineMetrics.actualBoundingBoxAscent +
      secondLineMetrics.actualBoundingBoxDescent;
    this.copyrightY =
      destCanvas.height -
      (heightFirstLine + paddingBetweenLines + heightSecondLine) / 2;
    destContext.restore();
  }

  drawElement(data, destCanvas, previousItemSize = [0, 0], side = "right") {
    const destContext = destCanvas.getContext("2d");
    const { scale } = this.props;
    const { src, width, height, rotation } = data;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;
      img.onload = () => {
        destContext.save();
        const elementWidth = (width || 80) * scale;
        const elementHeight = (height || 80) * scale;
        const left =
          side === "left"
            ? this.margin + elementWidth / 2
            : destCanvas.width - this.margin - elementWidth / 2;
        const top =
          (side === "left" && this.copyrightY
            ? this.copyrightY - 2 * this.padding
            : destCanvas.height) -
          this.margin -
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
        resolve([
          elementWidth + 2 * this.padding,
          elementHeight + 2 * this.padding,
        ]);
      };

      img.onerror = () => {
        resolve();
      };
    });
  }

  calculatePixelsToExport(mapToExport) {
    const { extent, coordinates } = this.props;
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
        x: pixelTopLeft[0],
        y: pixelTopLeft[1],
        w: pixelBottomRight[0] - pixelTopLeft[0],
        h: pixelBottomRight[1] - pixelTopLeft[1],
      };
    }
    return null;
  }

  createCanvasImage(mapToExport) {
    const { extraData } = this.props;

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
            // eslint-disable-next-line no-continue
            continue;
          }
          const clip = this.calculatePixelsToExport(mapToExport) || {
            x: 0,
            y: 0,
            w: canvas.width,
            h: canvas.height,
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

        this.margin = CanvasSaveButton.getMargin(destCanvas);

        // Custom info
        let logoPromise = Promise.resolve();
        if (destContext && extraData && extraData.logo) {
          logoPromise = this.drawElement(extraData.logo, destCanvas);
        }

        logoPromise.then((logoSize = [0, 0]) => {
          // North arrow
          let arrowPromise = Promise.resolve();
          if (destContext && extraData && extraData.northArrow) {
            arrowPromise = this.drawElement(
              {
                src: extraData.northArrow.circled
                  ? NorthArrowCircle
                  : NorthArrowSimple,
                ...extraData.northArrow,
              },
              destCanvas,
              logoSize,
            );
          }

          // Copyright
          arrowPromise.then((arrowSize = [0, 0]) => {
            const widestElement = Math.max(logoSize[0], arrowSize[0]);
            if (
              destContext &&
              extraData &&
              extraData.copyright &&
              extraData.copyright.text
            ) {
              const maxWidth =
                extraData.copyright.maxWidth ||
                (widestElement
                  ? destContext.canvas.width - widestElement - this.margin
                  : destContext.canvas.width);
              this.drawCopyright(destContext, destCanvas, maxWidth);
            }
            let qrCodePromise = Promise.resolve();
            if (destContext && extraData && extraData.qrCode) {
              qrCodePromise = this.drawElement(
                extraData.qrCode,
                destCanvas,
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
  }

  downloadCanvasImage(canvas) {
    console.log("this.multilineCopyright", this.multilineCopyright);
    // Use blob for large images
    const promise = new Promise((resolve) => {
      const { format } = this.props;
      if (/msie (9|10)/gi.test(window.navigator.userAgent.toLowerCase())) {
        // ie 9 and 10
        const url = canvas.toDataURL(format);
        const w = window.open("about:blank", "");
        w.document.write(`<img src="${url}" alt="from canvas"/>`);
        resolve(url);
      }
      if (window.navigator.msSaveBlob) {
        // ie 11 and higher
        let image;
        try {
          image = canvas.msToBlob();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
        }
        const blob = new Blob([image], {
          type: format,
        });
        resolve(blob);
        window.navigator.msSaveBlob(blob, this.getDownloadImageName());
      } else {
        canvas.toBlob((blob) => {
          const link = document.createElement("a");
          link.download = this.getDownloadImageName();
          link.href = URL.createObjectURL(blob);
          // append child to document for firefox to be able to download.
          document.body.appendChild(link);
          link.click();
          resolve(blob);
        }, format);
      }
    });
    return promise;
  }

  render() {
    const { children, ...other } = this.props;

    delete other.onSaveStart;
    delete other.onSaveEnd;
    delete other.extraData;
    delete other.extent;
    delete other.format;
    delete other.map;
    delete other.coordinates;
    delete other.autoDownload;
    delete other.scale;

    return (
      <div
        role="button"
        className="rs-canvas-save-button"
        tabIndex={0}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
        onClick={(e) => {
          return this.onClick(e);
        }}
        onKeyPress={(e) => {
          return e.which === 13 && this.onClick(e);
        }}
      >
        {children}
      </div>
    );
  }
}

CanvasSaveButton.propTypes = propTypes;
CanvasSaveButton.defaultProps = defaultProps;

export default CanvasSaveButton;
