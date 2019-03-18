import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { TiImage, TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FiMail } from 'react-icons/fi';
import BlankLink from '../BlankLink';
import Button from '../Button';

const configPropType = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    icon: PropTypes.shape(),
  }),
);

const propTypes = {
  /**
   * Translation function.
   */
  t: PropTypes.func,
  map: PropTypes.instanceOf(OLMap),
  className: PropTypes.string,
  classNameIcon: PropTypes.string,
  socialShareConfig: configPropType,
  extraSocialShareConfig: configPropType,
};

const defaultProps = {
  map: null,
  className: 'tm-share-menu',
  classNameIcon: 'tm-share-menu-icon',
  socialShareConfig: [
    {
      url: '//www.facebook.com/sharer.php?u={url}',
      title: 'Auf Facebook teilen.',
      icon: <TiSocialFacebook focusable={false} />,
    },
    {
      url: '//twitter.com/intent/tweet?url={url}',
      title: 'Twittern.',
      icon: <TiSocialTwitter focusable={false} />,
    },
    {
      url: 'mailto:?body={url}',
      title: 'Per Email teilen.',
      icon: <FiMail focusable={false} />,
      className: 'ta-mail-icon',
    },
  ],
  extraSocialShareConfig: [
    {
      title: 'Karte als Bild speichern.',
      icon: <TiImage focusable={false} />,
      className: 'ta-image-icon',
    },
  ],
  t: t => t,
};

class ShareMenu extends PureComponent {
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
        `${ShareMenu.getDownloadImageName()}.jpg`,
      );
    } else {
      const link = document.createElement('a');
      link.download = `${ShareMenu.getDownloadImageName()}.jpg`;
      link.href = this.getCanvasImage(opts);
      link.click();
    }

    if (window.navigator.msSaveBlob) {
      // ie only
      e.preventDefault();
      e.stopPropagation();
    }
  }

  renderImgSaveButton(conf) {
    return (
      <Button
        className="tm-share-button"
        title="Karte als Bild speichern."
        onClick={e => this.downloadCanvasImage(e)}
      >
        <span>{conf.icon}</span>
      </Button>
    );
  }

  render() {
    const {
      className,
      classNameIcon,
      socialShareConfig,
      extraSocialShareConfig,
      t,
    } = this.props;

    const config = [...socialShareConfig, ...extraSocialShareConfig];

    for (let i = 0; i < config.length; i += 1) {
      if (config[i].url) {
        config[i].url = config[i].url.replace('{url}', window.location.href);
      }
    }

    return (
      <div className={className}>
        {config.map(conf => (
          <div
            className={`${classNameIcon} ${conf.className || ''}`}
            key={conf.title}
          >
            {conf.url ? (
              <BlankLink href={conf.url} title={t(conf.title)}>
                {conf.icon}
              </BlankLink>
            ) : (
              this.renderImgSaveButton(conf)
            )}
          </div>
        ))}
      </div>
    );
  }
}

ShareMenu.propTypes = propTypes;
ShareMenu.defaultProps = defaultProps;

export default ShareMenu;
