import React from 'react';
import PropTypes from 'prop-types';
import { TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FiMail } from 'react-icons/fi';
import BlankLink from '../BlankLink';

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
  className: PropTypes.string,
  classNameIcon: PropTypes.string,
  socialShareConfig: configPropType,
  extraSocialShareConfig: configPropType,
};

const defaultProps = {
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
  extraSocialShareConfig: [],
  t: t => t,
};

const ShareMenu = ({
  className,
  classNameIcon,
  socialShareConfig,
  extraSocialShareConfig,
  t,
}) => {
  const config = [...socialShareConfig, ...extraSocialShareConfig];

  for (let i = 0; i < config.length; i += 1) {
    config[i].url = config[i].url.replace('{url}', window.location.href);
  }

  return (
    <div className={className}>
      {config.map(conf => (
        <div
          className={`${classNameIcon} ${conf.className || ''}`}
          key={conf.title}
        >
          <BlankLink href={conf.url} title={t(conf.title)}>
            {conf.icon}
          </BlankLink>
        </div>
      ))}
    </div>
  );
};

ShareMenu.propTypes = propTypes;
ShareMenu.defaultProps = defaultProps;

export default ShareMenu;
