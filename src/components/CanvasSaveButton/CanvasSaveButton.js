import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { getTopLeft, getBottomRight } from 'ol/extent';
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
   * Format to save the image.
   */
  saveFormat: PropTypes.oneOf(['image/jpeg', 'image/png']),

  /** An existing [ol/Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html). */
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
   * Extra data, such as copyright, north arrow configuration, or dpi.
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
          return this.layerService.getCopyrights();
        },
      },
      northArrow: {
        rotation: () => { // Rotation as function
          return NorthArrow.radToDeg(this.map.getView().getRotation());
        },
        circled, // Display circle around the north arrow (Does not work for custom src)
      },
    }
   * Example 4:
   *
    {
      dpi: 300, // dpi for exported image, default is 96
    }
   */
  extraData: PropTypes.object,
};

const defaultProps = {
  map: null,
  tabIndex: 0,
  className: 'tm-canvas-save-button tm-button',
  saveFormat: 'image/png',
  extent: null,
  extraData: null,
  coordinates: null,
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
  }

  getDownloadImageName() {
    return (
      `${window.document.title.replace(/ /g, '_').toLowerCase()}` +
      `.${this.fileExt}`
    );
  }

  createCanvasImage() {
    return new Promise(resolve => {
      const { map, extent, extraData, coordinates } = this.props;

      const dpi = extraData && extraData.dpi ? extraData.dpi : 96;
      const scaleFactor = dpi / 96;

      map.once('precompose', evt => {
        const { canvas } = evt.context;
        canvas.width = Math.ceil(canvas.width * scaleFactor);
        canvas.height = Math.ceil(canvas.height * scaleFactor);
        const ctx = canvas.getContext('2d');
        ctx.scale(scaleFactor, scaleFactor);
      });

      map.once('postcompose', evt => {
        const { canvas } = evt.context;

        let clip = {
          x: 0,
          y: 0,
          w: canvas.width,
          h: canvas.height,
        };

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
          const firstPixel = map.getPixelFromCoordinate(firstCoordinate);
          const oppositePixel = map.getPixelFromCoordinate(oppositeCoordinate);
          const pixelTopLeft = [
            firstPixel[0] <= oppositePixel[0]
              ? firstPixel[0]
              : oppositePixel[0],
            firstPixel[1] <= oppositePixel[1]
              ? firstPixel[1]
              : oppositePixel[1],
          ];
          const pixelBottomRight = [
            firstPixel[0] > oppositePixel[0] ? firstPixel[0] : oppositePixel[0],
            firstPixel[1] > oppositePixel[1] ? firstPixel[1] : oppositePixel[1],
          ];

          clip = {
            x: pixelTopLeft[0] * scaleFactor,
            y: pixelTopLeft[1] * scaleFactor,
            w: (pixelBottomRight[0] - pixelTopLeft[0]) * scaleFactor,
            h: (pixelBottomRight[1] - pixelTopLeft[1]) * scaleFactor,
          };
        }

        const destCanvas = document.createElement('canvas');
        destCanvas.width = clip.w;
        destCanvas.height = clip.h;
        const destContext = destCanvas.getContext('2d');

        // Draw map
        destContext.fillStyle = 'white';
        destContext.fillRect(0, 0, destCanvas.width, clip.h);
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

        const padding = 5;

        // Copyright
        if (extraData && extraData.copyright && extraData.copyright.text) {
          const text =
            typeof extraData.copyright.text === 'function'
              ? extraData.copyright.text()
              : extraData.copyright.text;

          destContext.font = extraData.copyright.font || '12px Arial';
          destContext.fillStyle = extraData.copyright.fillStyle || 'black';
          destContext.fillText(text, padding, clip.h - padding);
        }

        // North arrow
        if (extraData && extraData.northArrow) {
          const img = new Image();
          if (extraData.northArrow.src) {
            img.src = extraData.northArrow.src;
          } else {
            img.src = extraData.northArrow.circled
              ? NorthArrowCircle
              : NorthArrowSimple;
          }

          img.onload = () => {
            destContext.save();

            const arrowWidth = extraData.northArrow.width || 80;
            const arrowHeight = extraData.northArrow.height || 80;
            const arrowSize = Math.max(arrowWidth, arrowHeight);

            destContext.translate(
              clip.w - 2 * padding - arrowSize / 2,
              clip.h - 2 * padding - arrowSize / 2,
            );

            if (extraData.northArrow.rotation) {
              const rotation =
                typeof extraData.northArrow.rotation === 'function'
                  ? extraData.northArrow.rotation()
                  : extraData.northArrow.rotation;

              destContext.rotate(rotation * (Math.PI / 180));
            }

            destContext.drawImage(
              img,
              -arrowWidth / 2,
              -arrowHeight / 2,
              arrowWidth,
              arrowHeight,
            );

            destContext.restore();

            resolve(destCanvas);
          };
        } else {
          resolve(destCanvas);
        }

        // Re-render in order to revert to initial dpi
        map.renderSync();
      });
      map.renderSync();
    });
  }

  downloadCanvasImage(e) {
    this.createCanvasImage().then(canvas => {
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
        const link = document.createElement('a');
        link.download = this.getDownloadImageName();

        // Use blob for large images
        canvas.toBlob(blob => {
          link.href = URL.createObjectURL(blob);
          link.click();
        }, this.options.format);
      }
    });

    if (window.navigator.msSaveBlob) {
      // ie only
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    const { title, children, tabIndex, className } = this.props;
    return (
      <Button
        className={className}
        title={title}
        tabIndex={tabIndex}
        onClick={e => this.downloadCanvasImage(e)}
      >
        {children}
      </Button>
    );
  }
}

CanvasSaveButton.propTypes = propTypes;
CanvasSaveButton.defaultProps = defaultProps;

export default CanvasSaveButton;
