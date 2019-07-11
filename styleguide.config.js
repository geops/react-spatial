const path = require('path');
const { version } = require('./package.json');

module.exports = {
  title: `React-spatial ${version}`,
  template: {
    favicon: 'src/images/favicon.png',
  },
  assetsDir: 'src/',
  require: [
    path.join(__dirname, 'src/themes/default/examples.scss'),
    'ol/ol.css',
    'react-app-polyfill/ie11',
    'react-app-polyfill/stable',
  ],
  moduleAliases: {
    'react-spatial': path.resolve(__dirname, 'src'),
  },
  ribbon: {
    url: 'https://github.com/geops/react-spatial',
    text: 'Fork me on GitHub',
  },
  context: {
    exampleData: path.join(__dirname, 'data/ExampleData'),
    treeData: path.join(__dirname, 'data/TreeData'),
    topicData: path.join(__dirname, 'data/TopicData'),
  },
  sections: [
    {
      name: '',
      content: 'README.md',
    },
    {
      name: 'UI components',
      sections: [
        {
          name: 'Spatial',
          description: 'Spatial components',
          components: ['src/components/CanvasSaveButton/[A-Z]*.js'],
          exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
          usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
        },
      ],
      description:
        'A collection of react components for spatial web development.',
    },
  ],
  webpackConfig: {
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        // Transpile node dependencies, node deps are often not transpiled for IE11
        {
          test: [
            /\/node_modules\/(regexpu-core|unicode-.*|acorn-.*|query-string|strict-uri-encode)/,
            /\/node_modules\/(split-on-first|react-dev-utils|ansi-styles|jsts|estree-walker)/,
          ],
          loader: 'babel-loader',
        },
        // Transpile js
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        // Load css and scss files.
        {
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader', 'sass-loader?modules'],
        },
        {
          test: /^((?!url).)*\.svg$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'react-svg-loader',
              options: {
                jsx: true, // true outputs JSX tags
              },
            },
          ],
        },
        {
          test: /\.url\.svg$/,
          loader: 'url-loader',
        },
        {
          test: /\.png$/,
          use: [
            {
              loader: 'url-loader',
            },
          ],
        },
      ],
    },
  },
  styleguideComponents: {
    ComponentsList: path.join(__dirname, 'src/styleguidist/ComponentsList'),
  },
};
