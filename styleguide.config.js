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
          components: [
            'src/components/BaseLayerToggler/[A-Z]*.js',
            'src/components/BasicMap/[A-Z]*.js',
            'src/components/CanvasSaveButton/[A-Z]*.js',
            'src/components/Copyright/[A-Z]*.js',
            'src/components/FeatureExportButton/[A-Z]*.js',
            'src/components/FeatureStyler/[A-Z]*.js',
            'src/components/FitExtent/[A-Z]*.js',
            'src/components/Geolocation/[A-Z]*.js',
            'src/components/MousePosition/[A-Z]*.js',
            'src/components/NorthArrow/[A-Z]*.js',
            'src/components/OLE/[A-Z]*.js',
            'src/components/Popup/[A-Z]*.js',
            'src/components/ScaleLine/[A-Z]*.js',
            'src/components/Zoom/[A-Z]*.js',
          ],
          exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
          usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
        },
        {
          name: 'Menu',
          description: 'Menu components',
          components: [
            'src/components/LayerTree/[A-Z]*.js',
            'src/components/Menu/[A-Z]*.js',
            'src/components/MenuItem/[A-Z]*.js',
            'src/components/ShareMenu/[A-Z]*.js',
            'src/components/Sidebar/[A-Z]*.js',
            'src/components/SidebarMenuItem/[A-Z]*.js',
            'src/components/TopicList/[A-Z]*.js',
          ],
          exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
          usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
        },
        {
          name: 'Form',
          description: 'Form components',
          components: [
            'src/components/Autocomplete/[A-Z]*.js',
            'src/components/Checkbox/[A-Z]*.js',
            'src/components/PermalinkInput/[A-Z]*.js',
            'src/components/SearchInput/[A-Z]*.js',
            'src/components/Select/[A-Z]*.js',
            'src/components/SelectLinks/[A-Z]*.js',
          ],
          exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
          usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
        },
        {
          name: 'Basic',
          description: 'Basic components',
          components: [
            'src/components/ActionLink/[A-Z]*.js',
            'src/components/BlankLink/[A-Z]*.js',
            'src/components/Button/[A-Z]*.js',
            'src/components/Dialog/[A-Z]*.js',
            'src/components/Footer/[A-Z]*.js',
            'src/components/Header/[A-Z]*.js',
            'src/components/List/[A-Z]*.js',
            'src/components/ListItem/[A-Z]*.js',
            'src/components/Permalink/[A-Z]*.js',
            'src/components/ResizeHandler/[A-Z]*.js',
            'src/components/StopEvents/[A-Z]*.js',
            'src/components/Tabs/[A-Z]*.js',
            'src/components/Tab/[A-Z]*.js',
          ],
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
