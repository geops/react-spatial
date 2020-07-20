import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Logo from 'react-styleguidist/lib/client/rsg-components/Logo';
import Version from 'react-styleguidist/lib/client/rsg-components/Version';
import Styled from 'react-styleguidist/lib/client/rsg-components/Styled';
import docConfig from '../../doc/doc-config.json';

const xsmall = '@media (max-width: 600px)';

const styles = ({ mq }) => ({
  root: {
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    position: 'absolute',
    top: 0,
    width: '100%',
    color: '#61849c',
    borderBottom: '2px solid #61849c',
    backgroundColor: 'white',
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    [xsmall]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  title: {
    fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
    fontSize: 20,
    marginLeft: '1.5em',
    color: '#61849c',
    fontWeight: 'bold',
  },
  version: {
    padding: '10px 0 0 10px',
  },
  content: {
    marginTop: 60,
    height: 'calc(100% - 60px)',
    position: 'fixed',
    width: '100%',
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
    top: 60,
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
      <div>
        <header className={classes.header}>
          <div className={classes.bar}>
            <Logo>
              <a className={classes.title} href="/">
                {docConfig.appName}
              </a>
            </Logo>
          </div>
        </header>
      </div>
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
