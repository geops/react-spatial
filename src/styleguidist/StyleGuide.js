/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { geopsTheme, Header, Footer } from "@geops/geops-ui";
import {
  Hidden,
  ClickAwayListener,
  Collapse,
  List,
  ListItem,
  Link,
} from "@mui/material";
import {
  ArrowDropDownTwoTone as Open,
  ArrowDropUpTwoTone as Close,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import Version from "react-styleguidist/lib/client/rsg-components/Version";
import Styled from "react-styleguidist/lib/client/rsg-components/Styled";
import docConfig from "../../doc/doc-config.json";

const styles = ({ mq }) => {
  return {
    root: {
      backgroundColor: "white",

      "& .MuiAutocomplete-root": {
        margin: "20px 0",
        width: 300,
      },
    },
    version: {
      padding: "10px 0 0 10px",
    },
    content: {
      top: 68,
      bottom: 0,
      height: "calc(100vh - 60px)",
      position: "fixed",
      width: "100%",
      zIndex: 0,
    },
    scrollable: {
      overflowY: "scroll",
      height: "calc(100vh - 68px)",
      [mq.small]: {
        top: 40,
        position: "absolute",
        width: "100%",
        height: "calc(100vh - 108px)",
      },
    },
    main: {
      margin: "auto",
      width: "calc(100vw - 30px)",
      maxWidth: 1000,
      padding: [[15, 30]],
      paddingLeft: 230,
      paddingTop: 55,
      [mq.small]: {
        padding: 5,
      },
      display: "block",
    },
    sidebar: {
      backgroundColor: "#EFEFEF",
      border: "#e8e8e8 solid",
      borderWidth: "0 1px 0 0",
      position: "fixed",
      top: 68,
      left: 0,
      bottom: 0,
      width: "200px",
      overflow: "auto",
    },
    dropdown: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 10px 0",
      position: "fixed",
      backgroundColor: "#efefef",
      height: 40,
      width: "100%",
      zIndex: 99999,
      color: "#6987a1",
      borderBottom: "1px solid #6987a1",
    },
    footerWrapper: {
      marginLeft: 200,
      [mq.small]: {
        marginLeft: 0,
      },
    },
  };
};

export function StyleGuideRenderer({
  classes,
  children,
  version = null,
  toc,
  hasSidebar,
}) {
  const [apiKey, setApiKey] = useState();
  const [dropdownOpen, toggleDropdown] = useState(false);
  const [expanded, expandSection] = useState();
  const [selected, setSelected] = useState("Components");
  const [node, setNode] = useState();
  useEffect(() => {
    fetch("https://backend.developer.geops.io/publickey")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setApiKey(data.key);
      })
      .catch(() => {
        setApiKey("error");
        // eslint-disable-next-line no-console
        console.error("Request to get the apiKey failed");
      });
  }, []);

  useEffect(() => {
    if (!node) return;
    const { hash } = window.location;
    if (hash && hash !== "#") {
      document.querySelector(hash)?.scrollIntoView();
    }
  }, [node]);

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
          tabs={[
            { label: "Code", href: `${docConfig.githubRepo}`, component: "a" },
          ]}
        />
        <div className={classes.content}>
          <Hidden smUp>
            <div
              role="button"
              type="button"
              className={classes.dropdown}
              onClick={() => {
                return toggleDropdown(!dropdownOpen);
              }}
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
              <ClickAwayListener
                onClickAway={() => {
                  return toggleDropdown(false);
                }}
              >
                <List
                  component="div"
                  disablePadding
                  style={{
                    width: "100%",
                    overflow: "auto",
                    maxHeight: "calc(100vh - 150px)",
                    top: 40,
                    backgroundColor: "white",
                    boxShadow: "0 10px 15px #35353520",
                    zIndex: 99999,
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
                        style={{
                          fontWeight: "bold",
                          color: "#6987a1",
                          borderTop: "1px solid #e8e8e8",
                        }}
                      >
                        {section.name}
                      </ListItem>,
                      <Collapse
                        key={`${section.name}-components`}
                        in={expanded === section.name}
                        timeout="auto"
                        unmountOnExit
                      >
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
                              selected={selected === component.name}
                            >
                              <Link
                                style={{ display: "block", width: "100%" }}
                                href={`#${component.name.toLowerCase()}`}
                              >
                                {component.name}
                              </Link>
                            </ListItem>
                          );
                        })}
                      </Collapse>,
                    ];
                  })}
                </List>
              </ClickAwayListener>
            </Collapse>
          </Hidden>
          <div className={classes.scrollable} ref={(nodee) => setNode(nodee)}>
            <Hidden xsDown>
              <div className={classes.sidebar}>
                <header className={classes.version}>
                  {version && <Version>{version}</Version>}
                </header>
                {hasSidebar ? toc : null}
              </div>
            </Hidden>
            <main className={classes.main}>{children}</main>
            <div className={classes.footerWrapper}>
              <Footer
                onScrollToTop={() => {
                  node?.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                  });
                }}
              />
            </div>
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

StyleGuideRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/require-default-props
  version: PropTypes.string,
  toc: PropTypes.node.isRequired,
  hasSidebar: PropTypes.bool.isRequired,
};

export default Styled(styles)(StyleGuideRenderer);
