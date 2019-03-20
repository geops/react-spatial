import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FiMail } from 'react-icons/fi';
import BlankLink from '../BlankLink';

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

const propTypes = {
  /**
   * Translation function.
   */
  t: PropTypes.func,

  /**
   *  Children content of the ShareMenu.
   */
  children: PropTypes.element,

  /**
   * CSS class of the menu.
   */
  className: PropTypes.string,

  /**
   * CSS class of the icon.
   */
  classNameIcon: PropTypes.string,

  /**
   * Configuration for social sharing.
   */
  socialShareConfig: shareConfigPropType,

  /**
   * Configuration for extra social sharing.
   */
  extraSocialShareConfig: shareConfigPropType,
};

const defaultProps = {
  children: null,
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

class ShareMenu extends PureComponent {
  render() {
    const {
      children,
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
            <BlankLink href={conf.url} title={t(conf.title)}>
              {conf.icon}
            </BlankLink>
          </div>
        ))}
        {children}
      </div>
    );
  }
}

ShareMenu.propTypes = propTypes;
ShareMenu.defaultProps = defaultProps;

export default ShareMenu;
