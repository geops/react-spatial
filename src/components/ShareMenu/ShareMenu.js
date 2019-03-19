import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OLMap from 'ol/Map';
import { TiImage, TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FiMail } from 'react-icons/fi';
import BlankLink from '../BlankLink';
import CanvasSaveButton from '../CanvasSaveButton';

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
              <CanvasSaveButton conf={conf} map={map} />
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
