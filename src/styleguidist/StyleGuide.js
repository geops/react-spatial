import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Version from 'react-styleguidist/lib/client/rsg-components/Version';
import Styled from 'react-styleguidist/lib/client/rsg-components/Styled';
import docConfig from '../../doc/doc-config.json';

const xsmall = '@media (max-width: 600px)';

const styles = ({ mq }) => ({
  root: {
    backgroundColor: 'white',
  },
  header: {
    height: 100,
    position: 'absolute',
    top: 0,
    width: '100%',
    borderBottom: '2px solid #61849c',
    boxShadow: '0px 10px 15px #35353520',
    backgroundColor: 'white',
    padding: '0 70px',
    zIndex: 1,
    [xsmall]: {
      padding: '0 20px',
    },
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
    color: '#353535',
    textDecoration: 'none',
    fontFamily: 'Lato, sans-serif',
    fontSize: 22,
    [xsmall]: {
      fontSize: 15,
    },
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    width: 120,
    cursor: 'pointer',
    [xsmall]: {
      width: 100,
    },
  },
  title: {
    marginLeft: 15,
    cursor: 'pointer',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    height: '100%',
    width: 100,
    fontSize: 18,
    fontWeight: 400,
    padding: '6px 12px',
  },
  version: {
    padding: '10px 0 0 10px',
  },
  content: {
    marginTop: 100,
    height: 'calc(100% - 60px)',
    position: 'fixed',
    width: '100%',
    zIndex: 0,
  },
  scrollable: {
    overflowY: 'scroll',
    height: 'calc(100vh - 60px)',
  },
  main: {
    maxWidth: 1000,
    padding: [[15, 30]],
    paddingLeft: '230px',
    margin: [[0, 'auto']],
    [mq.small]: {
      padding: 15,
    },
    display: 'block',
  },
  components: {
    overflow: 'auto', // To prevent the pane from growing out of the screen
  },
  sidebar: {
    backgroundColor: '#f5f5f5',
    border: '#e8e8e8 solid',
    borderWidth: '0 1px 0 0',
    position: 'fixed',
    top: 100,
    left: 0,
    bottom: 0,
    width: '200px',
    overflow: 'auto',
  },
});

export function StyleGuideRenderer({
  classes,
  children,
  version,
  toc,
  hasSidebar,
}) {
  const [apiKey, setApiKey] = useState();
  useEffect(() => {
    fetch('https://developer.geops.io/publickey')
      .then((response) => response.json())
      .then((data) => {
        setApiKey(data.key);
      })
      .catch(() => {
        setApiKey('error');
        // eslint-disable-next-line no-console
        console.error('Request to get the apiKey failed');
      });
  }, []);

  if (!apiKey) {
    return null;
  }

  // Makes apiKey accessible for all components.
  window.apiKey = apiKey;

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.bar}>
          <a href="/" className={classes.logo}>
            <img
              className={classes.image}
              src="../images/geops_logo.svg"
              alt="not found"
            />
            <p className={classes.title}>{docConfig.appName}</p>
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={docConfig.githubRepo}
            className={classes.link}
          >
            Code
          </a>
        </div>
      </header>
      <div className={classes.content}>
        <div className={classes.scrollable}>
          <div className={classes.sidebar}>
            <header className={classes.version}>
              {version && <Version>{version}</Version>}
            </header>
            {hasSidebar ? toc : null}
          </div>
          <main className={classes.main}>{children}</main>
        </div>
      </div>
      <div id="promo">
        <a
          href={docConfig.githubRepo}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div id="promo-text">Fork me on GitHub</div>
        </a>
      </div>
    </div>
  );
}

StyleGuideRenderer.defaultProps = {
  version: null,
};

StyleGuideRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  version: PropTypes.string,
  toc: PropTypes.node.isRequired,
  hasSidebar: PropTypes.bool.isRequired,
};

export default Styled(styles)(StyleGuideRenderer);
