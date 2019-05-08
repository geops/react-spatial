import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { getTopLeft, getBottomRight } from 'ol/extent';
import { TiImage } from 'react-icons/ti';
import Button from '../Button';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import NorthArrowSimple from '!url-loader!../../images/northArrow.svg';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import NorthArrowCircle from '!url-loader!../../images/northArrowCircle.svg';

const propTypes = {
  /**
   * Title of the button.
   */
  title: PropTypes.string.isRequired,

  /**
   *  Children content of the button.
   */
  children: PropTypes.element,

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
   * Extra data, such as copyright and north arrow configuration.
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
   */
  extraData: PropTypes.object,
};

const defaultProps = {
  map: null,
  tabIndex: 0,
  children: <TiImage focusable={false} />,
  className: 'tm-canvas-save-button',
  saveFormat: 'image/png',
  extent: null,
  extraData: null,
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
      const { map, extent, extraData } = this.props;

      map.once('postcompose', evt => {
        const { canvas } = evt.context;

        let clip = {
          x: 0,
          y: 0,
          w: canvas.width,
          h: canvas.height,
        };

        if (extent) {
          const pixelTopLeft = map.getPixelFromCoordinate(getTopLeft(extent));
          const pixelBottomRight = map.getPixelFromCoordinate(
            getBottomRight(extent),
          );

          clip = {
            x: pixelTopLeft[0],
            y: pixelTopLeft[1],
            w: pixelBottomRight[0] - pixelTopLeft[0],
            h: pixelBottomRight[1] - pixelTopLeft[1],
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
