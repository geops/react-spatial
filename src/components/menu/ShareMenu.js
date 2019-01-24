import React from 'react';
import PropTypes from 'prop-types';
import { TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FiMail } from 'react-icons/fi';
import { withNamespaces } from 'react-i18next';
import BlankLink from '../link/BlankLink';

import './ShareMenu.scss';

const configPropType = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    icon: PropTypes.shape(),
  }),
);

const propTypes = {
  socialShareConfig: configPropType,
  extraSocialShareConfig: configPropType,

  // react-i18next
  t: PropTypes.func.isRequired,
};

const defaultProps = {
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
};

const ShareMenu = ({ socialShareConfig, extraSocialShareConfig, t }) => {
  const config = [...socialShareConfig, ...extraSocialShareConfig];

  for (let i = 0; i < config.length; i += 1) {
    config[i].url = config[i].url.replace('{url}', window.location.href);
  }

  return (
    <div id="share-menu">
      {config.map(conf => (
        <div
          className={`share-menu-icon ${conf.className || ''}`}
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

export default withNamespaces()(ShareMenu);
