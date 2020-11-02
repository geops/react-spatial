/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { geopsTheme, Header, Footer } from '@geops/geops-ui';
import {
  Hidden,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  Link,
} from '@material-ui/core';
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
    height: 'calc(100vh - 60px)',
    position: 'fixed',
    width: '100%',
    zIndex: 0,
  },
  scrollable: {
    overflowY: 'scroll',
    height: 'calc(100vh - 100px)',
    [mq.small]: {
      top: 60,
      position: 'absolute',
      width: '100%',
      height: 'calc(100vh - 160px)',
    },
  },
  main: {
    maxWidth: 1000,
    padding: [[15, 30]],
    paddingLeft: 230,
    paddingTop: 50,
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
    width: '200px',
    overflow: 'auto',
  },
  dropdown: {
    position: 'fixed',
    backgroundColor: '#EFEFEF',
    width: '100%',
    zIndex: 99999,
  },
});

const links = [
  {
    label: 'Privacy Policy',
    href: 'https://geops.ch/datenschutz',
  },
  {
    label: 'Imprint',
    href: 'https://geops.ch/impressum',
  },
];

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
          <Hidden mdUp>
            <div className={classes.dropdown}>
              <FormControl fullWidth>
                <InputLabel
                  style={{
                    paddingLeft: 10,
                    paddingBottom: 10,
                  }}
                  id="component-select"
                >
                  Components
                </InputLabel>
                <Select
                  style={{
                    paddingLeft: 10,
                    paddingBottom: 10,
                  }}
                  defaultValue=""
                  id="component-select"
                  labelWidth={20}
                  autoWidth
                >
                  {toc.props.sections.slice(1).map((section) => {
                    return [
                      <ListSubheader
                        style={{
                          fontWeight: 'bold',
                          fontSize: 20,
                        }}
                        disableSticky
                        value={section.name}
                      >
                        <Link
                          style={{ display: 'block', width: '100%' }}
                          href={`#section-${section.name.toLowerCase()}`}
                        >
                          {section.name}
                        </Link>
                      </ListSubheader>,
                      ...section.components.map((component) => {
                        return (
                          <MenuItem
                            style={{ display: 'block', width: '100%' }}
                            value={component.name}
                          >
                            <Link
                              style={{ display: 'block', width: '100%' }}
                              href={`#${component.name.toLowerCase()}`}
                            >
                              {component.name}
                            </Link>
                          </MenuItem>
                        );
                      }),
                    ];
                  })}
                </Select>
              </FormControl>
            </div>
          </Hidden>
          <div className={classes.scrollable}>
            <Hidden smDown>
              <div className={classes.sidebar}>
                <header className={classes.version}>
                  {version && <Version>{version}</Version>}
                </header>
                {hasSidebar ? toc : null}
              </div>
            </Hidden>
            <main className={classes.main}>{children}</main>
            <Footer links={links} />
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
