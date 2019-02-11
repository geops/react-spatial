/* eslint-disable */
const React = require('react');

const hasChildren = node => node && (node.children || (node.props
  && node.props.children));

const getChildren = node => (node && node.children ? node.children
  : node.props && node.props.children);

const renderNodes = (reactNodes) => {
  if (typeof reactNodes === 'string') {
    return reactNodes;
  }

  return Object.keys(reactNodes).map((key, i) => {
    const child = reactNodes[key];
    const isElement = React.isValidElement(child);

    if (typeof child === 'string') {
      return child;
    } if (hasChildren(child)) {
      const inner = renderNodes(getChildren(child));
      return React.cloneElement(
        child,
        { ...child.props, key: i },
        inner,
      );
    } if (typeof child === 'object' && !isElement) {
      return Object.keys(child).reduce(
        (str, childKey) => `${str}${child[childKey]}`, '',
      );
    }

    return child;
  });
};

module.exports = {
  // this mock makes sure any components using the translate HoC receive the t
  // function as a prop
  withTranslation: () => (Component) => {
    Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
    return Component;
  },
  Trans: ({ children }) => renderNodes(children),
  NamespacesConsumer: ({ children }) => children(k => k, { i18n: {} }),

  // mock if needed
  Interpolate: () => {},
  I18nextProvider: () => {},
  loadNamespaces: () => {},
  reactI18nextModule: () => {},
  setDefaults: () => {},
  getDefaults: () => {},
  setI18n: () => {},
  getI18n: jest.fn(() => ({
    changeLanguage: () => {console.log('mocked')}
  })),
};
