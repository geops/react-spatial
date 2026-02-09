/* eslint-disable import/no-unresolved */
import { Footer, geopsTheme, Header } from "@geops/geops-ui";
import {
  ArrowDropUpTwoTone as Close,
  ArrowDropDownTwoTone as Open,
} from "@mui/icons-material";
import {
  ClickAwayListener,
  Collapse,
  Link,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Styled from "react-styleguidist/lib/client/rsg-components/Styled";
import Version from "react-styleguidist/lib/client/rsg-components/Version";

import docConfig from "../../doc/doc-config.json";

const styles = ({ mq }) => {
  return {
    content: {
      bottom: 0,
      height: "calc(100vh - 60px)",
      position: "fixed",
      top: 68,
      width: "100%",
      zIndex: 0,
    },
    dropdown: {
      alignItems: "center",
      backgroundColor: "#efefef",
      borderBottom: "1px solid #6987a1",
      color: "#6987a1",
      display: "flex",
      height: 40,
      justifyContent: "space-between",
      padding: "0 10px 0",
      position: "fixed",
      width: "100%",
      zIndex: 99999,
    },
    footerWrapper: {
      marginLeft: 200,
      [mq.small]: {
        marginLeft: 0,
      },
    },
    main: {
      display: "block",
      margin: "auto",
      maxWidth: 1000,
      [mq.small]: {
        padding: 5,
      },
      padding: [[15, 30]],
      paddingLeft: 230,
      paddingTop: 55,
      width: "calc(100vw - 30px)",
    },
    root: {
      "& .MuiAutocomplete-root": {
        margin: "20px 0",
        width: 300,
      },

      backgroundColor: "white",
    },
    scrollable: {
      height: "calc(100vh - 68px)",
      [mq.small]: {
        height: "calc(100vh - 108px)",
        position: "absolute",
        top: 40,
        width: "100%",
      },
      overflowY: "scroll",
    },
    sidebar: {
      backgroundColor: "#EFEFEF",
      border: "#e8e8e8 solid",
      borderWidth: "0 1px 0 0",
      bottom: 0,
      left: 0,
      overflow: "auto",
      position: "fixed",
      top: 68,
      width: "200px",
    },
    version: {
      padding: "10px 0 0 10px",
    },
  };
};

export function StyleGuideRenderer({
  children,
  classes,
  hasSidebar,
  toc,
  version = null,
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
          tabs={[
            { component: "a", href: `${docConfig.githubRepo}`, label: "Code" },
          ]}
          title={docConfig.appName}
        />
        <div className={classes.content}>
          <Paper sx={{ display: { sm: "none", xs: "block" } }}>
            <div
              className={classes.dropdown}
              onClick={() => {
                return toggleDropdown(!dropdownOpen);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  toggleDropdown(!dropdownOpen);
                }
              }}
              role="button"
              tabIndex={0}
              type="button"
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
                    backgroundColor: "white",
                    boxShadow: "0 10px 15px #35353520",
                    maxHeight: "calc(100vh - 150px)",
                    overflow: "auto",
                    top: 40,
                    width: "100%",
                    zIndex: 99999,
                  }}
                >
                  {toc.props.sections.slice(1).map((section) => {
                    return [
                      <ListItem
                        button
                        key={section.name}
                        onClick={() => {
                          return expanded === section.name
                            ? expandSection()
                            : expandSection(section.name);
                        }}
                        style={{
                          borderTop: "1px solid #e8e8e8",
                          color: "#6987a1",
                          fontWeight: "bold",
                        }}
                      >
                        {section.name}
                      </ListItem>,
                      <Collapse
                        in={expanded === section.name}
                        key={`${section.name}-components`}
                        timeout="auto"
                        unmountOnExit
                      >
                        {section.components.map((component) => {
                          return (
                            <ListItem
                              button
                              key={component.name}
                              onClick={() => {
                                setSelected(component.name);
                                toggleDropdown(false);
                              }}
                              selected={selected === component.name}
                              style={{ paddingLeft: 32 }}
                              tabIndex={-1}
                            >
                              <Link
                                href={`#${component.name.toLowerCase()}`}
                                style={{ display: "block", width: "100%" }}
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
          </Paper>
          <div className={classes.scrollable} ref={(nodee) => setNode(nodee)}>
            <Paper sx={{ display: { sm: "block", xs: "none" } }}>
              <div className={classes.sidebar}>
                <header className={classes.version}>
                  {version && <Version>{version}</Version>}
                </header>
                {hasSidebar ? toc : null}
              </div>
            </Paper>
            <main className={classes.main}>{children}</main>
            <div className={classes.footerWrapper}>
              <Footer
                onScrollToTop={() => {
                  node?.scrollTo({
                    behavior: "smooth",
                    left: 0,
                    top: 0,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div id="promo">
          <a
            href={docConfig.githubRepo}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div id="promo-text">Fork me on GitHub</div>
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}

StyleGuideRenderer.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  hasSidebar: PropTypes.bool.isRequired,
  toc: PropTypes.node.isRequired,
  // eslint-disable-next-line react/require-default-props
  version: PropTypes.string,
};

export default Styled(styles)(StyleGuideRenderer);
