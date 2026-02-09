import PropTypes from "prop-types";
import React from "react";
// Import default implementation from react-styleguidist using the full path
import ComponentsListRenderer from "react-styleguidist/lib/client/rsg-components/ComponentsList/ComponentsListRenderer";
import getUrl from "react-styleguidist/lib/client/utils/getUrl";

const propTypes = {
  classes: PropTypes.object,
  hashPath: PropTypes.array,
  items: PropTypes.array.isRequired,
  useHashId: PropTypes.bool,
  useRouterLinks: PropTypes.bool,
};

const defaultProps = {
  hashPath: [],
};

function ComponentsList({
  classes,
  hashPath = defaultProps.hashPath,
  items,
  useHashId = true,
  useRouterLinks = false,
}) {
  const mappedItems = items.map((item) => {
    return {
      ...item,
      href: item.href
        ? item.href
        : // Conflict with Permalink Component: Remove the first '/' to avoid page reload on click
          getUrl({
            anchor: !useRouterLinks,
            hashPath: useRouterLinks ? hashPath : false,
            id: useRouterLinks ? useHashId : false,
            name: item.name,
            slug: item.slug,
          })
            .replace(/^\/index.html+/g, "")
            .replace(/^\/+/g, ""),
    };
  });
  return <ComponentsListRenderer classes={classes} items={mappedItems} />;
}

ComponentsList.propTypes = propTypes;

export default ComponentsList;
