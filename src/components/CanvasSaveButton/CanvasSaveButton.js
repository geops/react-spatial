import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import Button from '../Button';

const propTypes = {
  /**
   * Translation function.
   */
  t: PropTypes.func,
  conf: PropTypes.object.isRequired,
  map: PropTypes.instanceOf(OLMap),
  className: PropTypes.string,
};

const defaultProps = {
  map: null,
  className: 'tm-share-button',
  t: t => t,
};

/**
 * This component displays a button to save canvas as an image.
 * It is a sub-component of the ShareMenu.
 */
class CanvasSaveButton extends PureComponent {
  static getDownloadImageName() {
    return window.document.title.replace(/ /g, '_').toLowerCase();
  }

  getCanvasImage(opts, asMSBlob) {
    const { map } = this.props;
    let image;

    map.once('postcompose', evt => {
      const { canvas } = evt.context;
      const { height, width } = canvas;

      const destinationCanvas = document.createElement('canvas');
      destinationCanvas.width = width;
      destinationCanvas.height = height;

      const destContext = destinationCanvas.getContext('2d');
      destContext.fillStyle = 'white';
      destContext.fillRect(0, 0, width, height);
      destContext.drawImage(canvas, 0, 0, width, height, 0, 0, width, height);

      if (asMSBlob) {
        image = destinationCanvas.msToBlob();
      } else {
        image = destinationCanvas.toDataURL(opts.format || 'image/jpeg');
      }
    });
    map.renderSync();
    return image;
  }

  downloadCanvasImage(e, options) {
    const opts = options || { format: 'image/jpeg' };
    if (/msie (9|10)/gi.test(window.navigator.userAgent.toLowerCase())) {
      // ie 9 and 10
      const w = window.open('about:blank', '');
      w.document.write(
        `<img src="${this.getCanvasImage(opts)}" alt="from canvas"/>`,
      );
    } else if (window.navigator.msSaveBlob) {
      // ie 11 and higher
      window.navigator.msSaveBlob(
        new Blob([this.getCanvasImage(opts, true)], { type: opts.format }),
        `${CanvasSaveButton.getDownloadImageName()}.jpg`,
      );
    } else {
      const link = document.createElement('a');
      link.download = `${CanvasSaveButton.getDownloadImageName()}.jpg`;
      link.href = this.getCanvasImage(opts);
      link.click();
    }

    if (window.navigator.msSaveBlob) {
      // ie only
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    const { t, conf, className } = this.props;

    return (
      <Button
        className={className}
        title={t(conf.title)}
        onClick={e => this.downloadCanvasImage(e)}
      >
        {conf.icon}
      </Button>
    );
  }
}

CanvasSaveButton.propTypes = propTypes;
CanvasSaveButton.defaultProps = defaultProps;

export default CanvasSaveButton;
