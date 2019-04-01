import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { getTopLeft, getBottomRight } from 'ol/extent';
import { TiImage } from 'react-icons/ti';
import Button from '../Button';

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
};

const defaultProps = {
  map: null,
  tabIndex: 0,
  children: <TiImage focusable={false} />,
  className: 'tm-canvas-save-button',
  saveFormat: 'image/png',
  extent: null,
};

/**
 * This component displays a button to save canvas as an image.
 * It is a sub-component of the ShareMenu.
 */
class CanvasSaveButton extends PureComponent {
  constructor(props) {
    super(props);
    const { saveFormat, extent } = this.props;
    this.options = {
      format: saveFormat,
      extent,
    };
    this.fileExt = this.options.format === 'image/jpeg' ? 'jpg' : 'png';
  }

  getDownloadImageName() {
    return (
      `${window.document.title.replace(/ /g, '_').toLowerCase()}` +
      `.${this.fileExt}`
    );
  }

  getCanvasImage(opts, asMSBlob) {
    const { map } = this.props;
    let image;

    map.once('postcompose', evt => {
      const { canvas } = evt.context;

      let clip = {
        x: 0,
        y: 0,
        w: canvas.width,
        h: canvas.height,
      };

      if (opts.extent) {
        const pixelTopLeft = map.getPixelFromCoordinate(getTopLeft(opts.extent));
        const pixelBottomRight = map.getPixelFromCoordinate(getBottomRight(opts.extent));

        clip = {
          x: pixelTopLeft[0],
          y: pixelTopLeft[1],
          w: pixelBottomRight[0] - pixelTopLeft[0],
          h: pixelBottomRight[1] - pixelTopLeft[1],
        }
      }

      const destinationCanvas = document.createElement('canvas');
      destinationCanvas.width = clip.w;
      destinationCanvas.height = clip.h;

      const destContext = destinationCanvas.getContext('2d');
      destContext.fillStyle = 'white';
      destContext.fillRect(0, 0, clip.w, clip.h);
      destContext.drawImage(canvas, clip.x, clip.y, clip.w, clip.h, 0, 0, clip.w, clip.h);

      if (asMSBlob) {
        image = destinationCanvas.msToBlob();
      } else {
        image = destinationCanvas.toDataURL(opts.format);
      }
    });
    map.renderSync();
    return image;
  }

  downloadCanvasImage(e) {
    if (/msie (9|10)/gi.test(window.navigator.userAgent.toLowerCase())) {
      // ie 9 and 10
      const w = window.open('about:blank', '');
      w.document.write(
        `<img src="${this.getCanvasImage(this.options)}" alt="from canvas"/>`,
      );
    } else if (window.navigator.msSaveBlob) {
      // ie 11 and higher
      window.navigator.msSaveBlob(
        new Blob([this.getCanvasImage(this.options, true)], {
          type: this.options.format,
        }),
        this.getDownloadImageName(),
      );
    } else {
      const link = document.createElement('a');
      link.download = this.getDownloadImageName();
      link.href = this.getCanvasImage(this.options);
      link.click();
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
