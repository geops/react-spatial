/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { geopsTheme, Header, Footer } from '@geops/geops-ui';
import { ThemeProvider } from '@material-ui/core/styles';
import Version from 'react-styleguidist/lib/client/rsg-components/Version';
import Styled from 'react-styleguidist/lib/client/rsg-components/Styled';
import docConfig from '../../doc/doc-config.json';

const styles = ({ mq }) => ({
  root: {
    backgroundColor: 'white',
  },
  version: {
    padding: '10px 0 0 10px',
  },
  content: {
    top: 100,
    bottom: 0,
    marginBottom: 70,
    height: 'calc(100vh - 60px)',
    position: 'fixed',
    width: '100%',
    zIndex: 0,
  },
  scrollable: {
    overflowY: 'scroll',
    height: 'calc(100vh - 170px)',
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
    backgroundColor: '#EFEFEF',
    border: '#e8e8e8 solid',
    borderWidth: '0 1px 0 0',
    position: 'fixed',
    top: 100,
    left: 0,
    bottom: 0,
    marginBottom: 70,
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
    <ThemeProvider theme={geopsTheme}>
      <div className={classes.root}>
        <Header
          title={docConfig.appName}
          tabs={[{ label: 'Code', href: `${docConfig.githubRepo}` }]}
        />
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
      <Footer />
    </ThemeProvider>
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
