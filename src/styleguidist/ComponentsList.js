import React from "react";
import PropTypes from "prop-types";
// Import default implementation from react-styleguidist using the full path
import ComponentsListRenderer from "react-styleguidist/lib/client/rsg-components/ComponentsList/ComponentsListRenderer";
import getUrl from "react-styleguidist/lib/client/utils/getUrl";

const propTypes = {
  items: PropTypes.array.isRequired,
  classes: PropTypes.object,
  hashPath: PropTypes.array,
  useRouterLinks: PropTypes.bool,
  useHashId: PropTypes.bool,
};

const defaultProps = {
  hashPath: [],
};

function ComponentsList({
  classes,
  items,
  useRouterLinks = false,
  useHashId = true,
  hashPath = defaultProps.hashPath,
}) {
  const mappedItems = items.map((item) => {
    return {
      ...item,
      href: item.href
        ? item.href
        : // Conflict with Permalink Component: Remove the first '/' to avoid page reload on click
          getUrl({
            name: item.name,
            slug: item.slug,
            anchor: !useRouterLinks,
            hashPath: useRouterLinks ? hashPath : false,
            id: useRouterLinks ? useHashId : false,
          })
            .replace(/^\/index.html+/g, "")
            .replace(/^\/+/g, ""),
    };
  });
  return <ComponentsListRenderer classes={classes} items={mappedItems} />;
}

ComponentsList.propTypes = propTypes;

export default ComponentsList;
