/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { geopsTheme, Header, Footer } from '@geops/geops-ui';
import {
  Hidden,
  ClickAwayListener,
  Collapse,
  List,
  ListItem,
  Link,
} from '@material-ui/core';
import Open from '@material-ui/icons/ArrowDropDownTwoTone';
import Close from '@material-ui/icons/ArrowDropUpTwoTone';
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
      top: 50,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px 0',
    position: 'fixed',
    backgroundColor: '#efefef',
    height: 40,
    width: '100%',
    zIndex: 99999,
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
  const [dropdownOpen, toggleDropdown] = useState(false);
  const [expanded, expandSection] = useState();
  const [selected, setSelected] = useState('Components');
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
          <Hidden smUp>
            <div
              role="button"
              type="button"
              className={classes.dropdown}
              onClick={() => toggleDropdown(!dropdownOpen)}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  toggleDropdown(!dropdownOpen);
                }
              }}
              tabIndex={0}
            >
              {selected}
              {dropdownOpen ? <Close /> : <Open />}
            </div>
            <Collapse in={dropdownOpen} timeout="auto" unmountOnExit>
              <ClickAwayListener onClickAway={() => toggleDropdown(false)}>
                <List
                  component="div"
                  disablePadding
                  style={{
                    zIndex: 99999,
                    backgroundColor: 'white',
                    width: '100%',
                    boxShadow: '0px 10px 15px #35353520',
                    position: 'absolute',
                    top: 40,
                    overflowY: 'scroll',
                  }}
                >
                  {toc.props.sections.slice(1).map((section) => {
                    return [
                      <ListItem
                        key={section.name}
                        button
                        onClick={() => {
                          return expanded === section.name
                            ? expandSection()
                            : expandSection(section.name);
                        }}
                        style={{ fontWeight: 'bold' }}
                      >
                        {section.name}
                      </ListItem>,
                      <Collapse
                        key={`${section.name}-components`}
                        in={expanded === section.name}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List disablePadding>
                          {section.components.map((component) => {
                            return (
                              <ListItem
                                key={component.name}
                                button
                                style={{ paddingLeft: 32 }}
                                onClick={() => {
                                  setSelected(component.name);
                                  toggleDropdown(false);
                                }}
                                tabIndex={-1}
                              >
                                <Link
                                  style={{ display: 'block', width: '100%' }}
                                  href={`#${component.name.toLowerCase()}`}
                                >
                                  {component.name}
                                </Link>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>,
                    ];
                  })}
                </List>
              </ClickAwayListener>
            </Collapse>
          </Hidden>
          <div className={classes.scrollable}>
            <Hidden xsDown>
              <div className={classes.sidebar}>
                <header className={classes.version}>
                  {version && <Version>{version}</Version>}
                </header>
                {hasSidebar ? toc : null}
              </div>
            </Hidden>
            <main className={classes.main}>{children}</main>
            <Footer />
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
