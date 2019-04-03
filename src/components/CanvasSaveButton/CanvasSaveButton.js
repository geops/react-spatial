import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { getTopLeft, getBottomRight } from 'ol/extent';
import { TiImage } from 'react-icons/ti';
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
        text: 'Example copyright', // Copyright text
        font: '10px Arial', // Font, default is '12px Arial'
        fillStyle: 'blue', // Fill style, default is 'black'
      }
      northArrow,  // True if the north arrow
                   // should be placed with default configuration
                   // (rotation=0, circled=False)
    }
   * Example 2:
   *

    {
      northArrow: {
        rotation: 25, // Absolute rotation in degrees
        circled, // Display circle around the north arrow
      }
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

  createCanvasImage(opts, asMSBlob) {
    return new Promise(resolve => {
      const { map, extent, extraData } = this.props;
      let image;

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
        const arrowSize = 80;

        // Copyright
        if (extraData && extraData.copyright && extraData.copyright.text) {
          destContext.font = extraData.copyright.font || '12px Arial';
          destContext.fillStyle = extraData.copyright.fillStyle || 'black';
          destContext.fillText(
            extraData.copyright.text,
            padding,
            clip.h - padding,
          );
        }

        // North arrow
        if (extraData && extraData.northArrow) {
          const img = new Image();
          img.src = extraData.northArrow.circled
            ? NorthArrowCircle
            : NorthArrowSimple;

          img.onload = () => {
            destContext.save();

            destContext.translate(
              clip.w - 2 * padding - arrowSize / 2,
              clip.h - 2 * padding - arrowSize / 2,
            );

            if (extraData.northArrow.rotation) {
              destContext.rotate(
                extraData.northArrow.rotation * (Math.PI / 180),
              );
            }

            destContext.drawImage(
              img,
              -arrowSize / 2,
              -arrowSize / 2,
              arrowSize,
              arrowSize,
            );

            destContext.restore();

            image = asMSBlob
              ? destCanvas.msToBlob()
              : destCanvas.toDataURL(opts.format);
            resolve(image);
          };
        } else {
          image = asMSBlob
            ? destCanvas.msToBlob()
            : destCanvas.toDataURL(opts.format);
          resolve(image);
        }
      });
      map.renderSync();
    });
  }

  downloadCanvasImage(e) {
    if (/msie (9|10)/gi.test(window.navigator.userAgent.toLowerCase())) {
      // ie 9 and 10
      const w = window.open('about:blank', '');

      this.createCanvasImage(this.options, false).then(image => {
        w.document.write(`<img src="${image}" alt="from canvas"/>`);
      });
    } else if (window.navigator.msSaveBlob) {
      // ie 11 and higher

      this.createCanvasImage(this.options, true).then(image => {
        window.navigator.msSaveBlob(
          new Blob([image], {
            type: this.options.format,
          }),
          this.getDownloadImageName(),
        );
      });
    } else {
      this.createCanvasImage(this.options, false).then(image => {
        const link = document.createElement('a');
        link.download = this.getDownloadImageName();
        link.href = image;
        link.click();
      });
    }

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
