import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { getTopLeft, getBottomRight } from 'ol/extent';
import XYZ from 'ol/source/XYZ';
import WMTS from 'ol/source/WMTS';
import LayerService from '../../LayerService';
import Button from '../Button';
import NorthArrowSimple from '../../images/northArrow.url.svg';
import NorthArrowCircle from '../../images/northArrowCircle.url.svg';

const propTypes = {
  /**
   * Title of the button.
   */
  title: PropTypes.string.isRequired,

  /**
   *  Children content of the button.
   */
  children: PropTypes.element.isRequired,

  /**
   * CSS class of the button.
   */
  className: PropTypes.string,

  /**
   * HTML tabIndex attribute
   */
  tabIndex: PropTypes.number,

  /**
   * HTML disabled attribute
   */
  disabled: PropTypes.bool,

  /**
   * Format to save the image.
   */
  saveFormat: PropTypes.oneOf(['image/jpeg', 'image/png']),

  /** An existing [ol/Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html). */
  map: PropTypes.instanceOf(OLMap),

  /**
   * Layers provider. Only needed if you plan to export HiDpi layers.
   */
  layerService: PropTypes.instanceOf(LayerService),

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
                   // (default image, rotation=0, circled=False)
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
          return this.getCopyright();
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
  extraData: PropTypes.object,
};

const defaultProps = {
  map: null,
  layerService: null,
  tabIndex: 0,
  className: 'tm-canvas-save-button tm-button',
  saveFormat: 'image/png',
  extent: null,
  extraData: null,
  coordinates: null,
  scale: 1,
  disabled: undefined,
  onSaveStart: () => {},
  onSaveEnd: () => {},
};

/**
 * This component displays a button to save canvas as an image.
 * It is a sub-component of the ShareMenu.
 */
class CanvasSaveButton extends PureComponent {
  constructor(props) {
    super(props);
    const { saveFormat } = this.props;
    this.options = {
      format: saveFormat,
    };
    this.fileExt = this.options.format === 'image/jpeg' ? 'jpg' : 'png';
    this.padding = 5;
  }

  getDownloadImageName() {
    return (
      `${window.document.title.replace(/ /g, '_').toLowerCase()}` +
      `.${this.fileExt}`
    );
  }

  buildMapHd() {
    const { map, scale, layerService } = this.props;

    if (scale === 1) {
      return map;
    }

    const mapToExport = new OLMap({ controls: [], pixelRatio: scale });
    mapToExport.setView(map.getView());

    map.getLayers().forEach(layer => {
      if (!layer.getVisible()) {
        return;
      }
      if (
        layerService &&
        (layer.getSource() instanceof XYZ || layer.getSource() instanceof WMTS)
      ) {
        const layerConf = layerService.getLayer(layer.get('name'));
        if (layerConf && layerConf.olLayersHd[scale]) {
          mapToExport.addLayer(layerConf.olLayersHd[scale]);
          return;
        }
      }
      mapToExport.addLayer(layer);
    });
    mapToExport.setTarget(map.getTarget());
    mapToExport.getView().setCenter(map.getView().getCenter());
    mapToExport.getView().setResolution(map.getView().getResolution());

    return mapToExport;
  }

  clean(mapToExport) {
    const { scale } = this.props;
    if (scale === 1) {
      return;
    }
    mapToExport.getLayers().clear();
    mapToExport.setTarget(null);
  }

  // Ensure the font size fita with the image width.
  decreaseFontSize(destContext, arrowWidth, copyright, scale) {
    const minFontSize = 8;
    let sizeMatch = destContext.font.match(/[0-9]+(?:\.[0-9]+)?(px)/i);
    let fontSize = parseInt(sizeMatch[0].replace(sizeMatch[1], ''), 10);
    do {
      sizeMatch = destContext.font.match(/[0-9]+(?:\.[0-9]+)?(px)/i);
      fontSize = parseInt(sizeMatch[0].replace(sizeMatch[1], ''), 10);

      // eslint-disable-next-line no-param-reassign
      destContext.font = destContext.font.replace(fontSize, fontSize - 1);

      if (fontSize - 1 === minFontSize) {
        this.multilineCopyright = true;
      }
    } while (
      fontSize - 1 > minFontSize &&
      destContext.measureText(copyright).width * scale >
        destContext.canvas.width - arrowWidth
    );
  }

  // If minimal fontsize is reached, divide copyright in two lines.
  splitCopyrightLine(destContext, clip, arrowWidth, copyright, scale) {
    let newCopyright = copyright;
    const limitWidth = destContext.canvas.width - arrowWidth;
    const wordNumber = copyright.split(' ').length;

    for (let i = 0; i < wordNumber; i += 1) {
      newCopyright = newCopyright.substring(0, newCopyright.lastIndexOf(' '));
      // Stop removing word when fits within one line.
      if (destContext.measureText(newCopyright).width * scale < limitWidth) {
        break;
      }
    }

    // Draw fist line (line break isn't supported for fillText).
    destContext.fillText(
      newCopyright,
      this.padding,
      clip.h / scale - 3 * this.padding,
    );

    // Draw second line.
    destContext.fillText(
      copyright.replace(newCopyright, ''),
      this.padding,
      clip.h / scale - this.padding,
    );
  }

  drawCopyright(destContext, clip, arrowWidth) {
    const { extraData, scale } = this.props;
    const { text, font, fillStyle } = extraData.copyright;
    const copyright = typeof text === 'function' ? text() : text;
    this.multilineCopyright = false;

    destContext.save();
    destContext.scale(scale, scale);
    // eslint-disable-next-line no-param-reassign
    destContext.font = font || '12px Arial';
    // eslint-disable-next-line no-param-reassign
    destContext.fillStyle = fillStyle || 'black';

    this.decreaseFontSize(destContext, arrowWidth * scale, copyright, scale);

    if (this.multilineCopyright) {
      this.splitCopyrightLine(
        destContext,
        clip,
        arrowWidth * scale,
        copyright,
        scale,
      );
    } else {
      destContext.fillText(
        copyright,
        this.padding,
        clip.h / scale - this.padding,
      );
    }
    destContext.restore();
  }

  drawNorthArrow(destContext, clip) {
    const { scale, extraData } = this.props;
    const { src, circled, width, height, rotation } = extraData.northArrow;

    return new Promise(resolve => {
      const img = new Image();
      img.src = src || circled ? NorthArrowCircle : NorthArrowSimple;

      img.onload = () => {
        destContext.save();
        const arrowWidth = (width || 80) * scale;
        const arrowHeight = (height || 80) * scale;
        destContext.translate(
          clip.w - 2 * this.padding - arrowWidth / 2,
          clip.h - 2 * this.padding - arrowHeight / 2,
        );

        if (rotation) {
          const angle = typeof rotation === 'function' ? rotation() : rotation;
          destContext.rotate(angle * (Math.PI / 180));
        }

        destContext.drawImage(
          img,
          -arrowWidth / 2,
          -arrowHeight / 2,
          arrowWidth,
          arrowHeight,
        );
        destContext.restore();

        // Return the pixels width of the arrow and the margin right,
        // that must not be occupied by the copyright.
        resolve(arrowWidth + 2 * this.padding);
      };

      img.onerror = () => {
        resolve();
      };
    });
  }

  calculatePixelsToExport(mapToExport, canvas) {
    const { extent, scale, coordinates } = this.props;
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
      const oppositePixel = mapToExport.getPixelFromCoordinate(
        oppositeCoordinate,
      );
      const pixelTopLeft = [
        firstPixel[0] <= oppositePixel[0] ? firstPixel[0] : oppositePixel[0],
        firstPixel[1] <= oppositePixel[1] ? firstPixel[1] : oppositePixel[1],
      ];
      const pixelBottomRight = [
        firstPixel[0] > oppositePixel[0] ? firstPixel[0] : oppositePixel[0],
        firstPixel[1] > oppositePixel[1] ? firstPixel[1] : oppositePixel[1],
      ];

      return {
        x: pixelTopLeft[0] * scale,
        y: pixelTopLeft[1] * scale,
        w: (pixelBottomRight[0] - pixelTopLeft[0]) * scale,
        h: (pixelBottomRight[1] - pixelTopLeft[1]) * scale,
      };
    }
    return {
      x: 0,
      y: 0,
      w: canvas.width,
      h: canvas.height,
    };
  }

  createCanvasImage() {
    const { scale, extraData } = this.props;
    const mapToExport = this.buildMapHd();

    return new Promise(resolve => {
      mapToExport.once('rendercomplete', evt => {
        const { canvas } = evt.context;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);

        // Define the zone to export in pixels.
        const clip = this.calculatePixelsToExport(mapToExport, canvas);

        // Create the canvas to export with the good size.
        const destCanvas = document.createElement('canvas');
        destCanvas.width = clip.w;
        destCanvas.height = clip.h;
        const destContext = destCanvas.getContext('2d');

        // Draw map
        destContext.fillStyle = 'white';
        destContext.fillRect(0, 0, clip.w, clip.h);
        destContext.drawImage(
          canvas,
          clip.x,
          clip.y,
          clip.w,
          clip.h,
          0,
          0,
          clip.w,
          clip.h,
        );

        // North arrow
        let p = Promise.resolve();
        if (extraData && extraData.northArrow) {
          p = this.drawNorthArrow(destContext, clip);
        }

        p.then(res => {
          const arrowWidth = res || 0;
          // Copyright
          if (extraData && extraData.copyright && extraData.copyright.text) {
            this.drawCopyright(destContext, clip, arrowWidth);
          }

          this.clean(mapToExport);
          resolve(destCanvas);
        });
      });
      mapToExport.renderSync();
    });
  }

  downloadCanvasImage(canvas) {
    if (/msie (9|10)/gi.test(window.navigator.userAgent.toLowerCase())) {
      // ie 9 and 10
      const url = canvas.toDataURL(this.options.format);
      const w = window.open('about:blank', '');
      w.document.write(`<img src="${url}" alt="from canvas"/>`);
    } else if (window.navigator.msSaveBlob) {
      // ie 11 and higher
      const image = canvas.msToBlob();
      window.navigator.msSaveBlob(
        new Blob([image], {
          type: this.options.format,
        }),
        this.getDownloadImageName(),
      );
    } else {
      // Use blob for large images
      canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.download = this.getDownloadImageName();
        link.href = URL.createObjectURL(blob);
        link.click();
      }, this.options.format);
    }
  }

  render() {
    const {
      title,
      children,
      tabIndex,
      className,
      disabled,
      onSaveStart,
      onSaveEnd,
    } = this.props;

    return (
      <Button
        className={className}
        title={title}
        tabIndex={tabIndex}
        disabled={disabled}
        onClick={e => {
          if (window.navigator.msSaveBlob) {
            // ie only
            e.preventDefault();
            e.stopPropagation();
          }

          onSaveStart();
          this.createCanvasImage()
            .then(canvas => {
              this.downloadCanvasImage(canvas);
              onSaveEnd();
            })
            .catch(err => {
              onSaveEnd(err);
            });
        }}
      >
        {children}
      </Button>
    );
  }
}

CanvasSaveButton.propTypes = propTypes;
CanvasSaveButton.defaultProps = defaultProps;

export default CanvasSaveButton;
