import React from 'react';
import PropTypes from 'prop-types';
// Import default implementation from react-styleguidist using the full path
import ComponentsListRenderer from 'react-styleguidist/lib/client/rsg-components/ComponentsList/ComponentsListRenderer';
import getUrl from 'react-styleguidist/lib/client/utils/getUrl';

const propTypes = {
  items: PropTypes.array.isRequired,
  classes: PropTypes.object,
  hashPath: PropTypes.array,
  useRouterLinks: PropTypes.bool,
  useHashId: PropTypes.bool,
};

const defaultProps = {
  classes: null,
  hashPath: [],
  useRouterLinks: false,
  useHashId: true,
};

function ComponentsList({
  classes,
  items,
  useRouterLinks = false,
  useHashId,
  hashPath,
}) {
  const mappedItems = items.map(item => ({
    ...item,
    href: getUrl({
      name: item.name,
      slug: item.slug,
      anchor: !useRouterLinks,
      hashPath: useRouterLinks ? hashPath : false,
      id: useRouterLinks ? useHashId : false,
    }).replace(/^\/+/g, ''),
  }));
  return <ComponentsListRenderer classes={classes} items={mappedItems} />;
}

ComponentsList.propTypes = propTypes;
ComponentsList.defaultProps = defaultProps;

export default ComponentsList;
