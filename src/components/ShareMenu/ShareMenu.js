import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { TiImage, TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FiMail } from 'react-icons/fi';
import BlankLink from '../BlankLink';
import CanvasSaveButton from '../CanvasSaveButton';

const shareConfigPropType = PropTypes.arrayOf(
  PropTypes.shape({
    /**
     * Title of the button.
     */
    title: PropTypes.string,
    /**
     * Url for href.
     */
    url: PropTypes.string,
    /**
     * Icon for the button.
     */
    icon: PropTypes.shape(),
    /**
     * CSS class of the button.
     */
    className: PropTypes.string,
  }),
);

const extraConfigPropType = PropTypes.arrayOf(
  PropTypes.shape({
    /**
     * Title of the button.
     */
    title: PropTypes.string,
    /**
     * Icon for the button.
     */
    icon: PropTypes.shape(),
    /**
     * CSS class of the button.
     */
    className: PropTypes.string,
    /**
     * Format to save the image in ('image/jpeg' or 'image/png')
     */
    saveFormat: PropTypes.string,
  }),
);

const propTypes = {
  /**
   * Translation function.
   */
  t: PropTypes.func,

  /** An existing [ol/Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html). */
  map: PropTypes.instanceOf(OLMap),

  /**
   * CSS class of the menu.
   */
  className: PropTypes.string,

  /**
   * CSS class of the icon.
   */
  classNameIcon: PropTypes.string,

  /**
   * Confiuration for social sharing.
   */
  socialShareConfig: shareConfigPropType,

  /**
   * Confiuration for extra social sharing.
   */
  extraSocialShareConfig: extraConfigPropType,
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
      saveFormat: 'image/jpeg',
    },
  ],
  t: t => t,
};

class ShareMenu extends PureComponent {
  render() {
    const {
      map,
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
              <CanvasSaveButton
                title={conf.title}
                saveFormat={conf.saveFormat}
                map={map}
              >
                {conf.icon}
              </CanvasSaveButton>
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
