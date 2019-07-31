import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'react-styleguidist/lib/client/rsg-components/Logo';
import Styled from 'react-styleguidist/lib/client/rsg-components/Styled';

const xsmall = '@media (max-width: 600px)';

const styles = ({ font, mq }) => ({
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
  nav: {
    fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
    marginLeft: 'auto',
    marginRight: '1.5em',
    [xsmall]: {
      margin: [[10, 0, 0]],
    },
  },
  headerLink: {
    '&, &:link, &:visited': {
      marginLeft: '0.5em',
      marginRight: '0.5em',
      fontFamily: font,
    },
    '&:hover, &:active': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
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

export function StyleGuideRenderer({ classes, children, toc, hasSidebar }) {
  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <div className={classes.root}>
      <div>
        <header className={classes.header}>
          <div className={classes.bar}>
            <Logo>
              <a
                className={classes.title}
                href="https://github.com/geops/react-spatial"
              >
                react-spatial
              </a>
            </Logo>
            <nav className={classes.nav}>
              <a className={`${classes.headerLink} link-active`} href="/">
                Components
              </a>
              <a className={classes.headerLink} href="/jsdoc.html">
                Layers
              </a>
            </nav>
          </div>
        </header>
      </div>
      <div className={classes.content}>
        <div className={classes.scrollable}>
          <div className={classes.sidebar}>{hasSidebar ? toc : null}</div>
          <main className={classes.main}>{children}</main>
        </div>
      </div>
    </div>
  );
  /* eslint-enable */
}

StyleGuideRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  toc: PropTypes.node.isRequired,
  hasSidebar: PropTypes.bool.isRequired,
};

export default Styled(styles)(StyleGuideRenderer);
