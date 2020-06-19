const path = require('path');
const { version } = require('./package.json');

module.exports = {
  version,
  template: {
    favicon: 'images/favicon.png',
  },
  assetsDir: 'src/',
  styleguideDir: 'styleguide-build',
  require: [
    path.join(__dirname, 'src/themes/default/examples.scss'),
    path.join(__dirname, 'src/styleguidist/styleguidist.css'),
    'ol/ol.css',
    'react-app-polyfill/ie11',
    'react-app-polyfill/stable',
  ],
  moduleAliases: {
    'react-spatial': path.resolve(__dirname, 'src'),
  },
  context: {
    exampleData: path.join(__dirname, 'data/ExampleData'),
    treeData: path.join(__dirname, 'data/TreeData'),
  },
  sections: [
    {
      name: '',

      content: 'README.md',
    },
    {
      name: 'Maps',
      description:
        'A collection of react components for spatial web development of map components.',
      components: [
        'src/components/maps/BaseLayerSwitcher/[A-Z]*.js',
        'src/components/maps/BaseLayerToggler/[A-Z]*.js',
        'src/components/maps/BasicMap/[A-Z]*.js',
        'src/components/maps/CanvasSaveButton/[A-Z]*.js',
        'src/components/maps/Copyright/[A-Z]*.js',
        'src/components/maps/FeatureExportButton/[A-Z]*.js',
        'src/components/maps/FitExtent/[A-Z]*.js',
        'src/components/maps/Geolocation/[A-Z]*.js',
        'src/components/maps/LayerTree/[A-Z]*.js',
        'src/components/maps/MousePosition/[A-Z]*.js',
        'src/components/maps/NorthArrow/[A-Z]*.js',
        'src/components/maps/Permalink/[A-Z]*.js',
        'src/components/maps/Popup/[A-Z]*.js',
        'src/components/maps/ScaleLine/[A-Z]*.js',
        'src/components/maps/Zoom/[A-Z]*.js',
      ],
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
    },
    {
      name: 'Realtime',
      description:
        'A collection of react components for spatial web development of realtime components.',
      components: [
        'src/components/realtime/RouteSchedule/[A-Z]*.js',
        'src/components/realtime/TrackerControl/[A-Z]*.js',
      ],
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
    },
    {
      name: 'Stops',
      description:
        'A collection of react components for spatial web development of stops components.',
      components: [
        'src/components/stops/Search/Search.js',
      ],
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
    },
  ],
  webpackConfig: {
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        // Transpile node dependencies, node deps are often not transpiled for IE11
        {
          test: [
            /\/node_modules\/(regexpu-core|unicode-.*|chalk|acorn-.*|query-string|strict-uri-encode|javascript-stringify)/,
            /\/node_modules\/(split-on-first|react-dev-utils|ansi-styles|jsts|estree-walker|strip-ansi)/,
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
          use: ['style-loader', 'css-loader', 'sass-loader'],
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
  styles: {
    StyleGuide: {
      '@global body': {
        overflowY: 'hidden',
        overflowX: 'hidden',
        fontFamily: 'Arial',
      },
    },
    Playground: {
      preview: {
        fontSize: '12px',
      },
    },
  },
  showSidebar: true,
  styleguideComponents: {
    ComponentsList: path.join(__dirname, 'src/styleguidist/ComponentsList'),
    StyleGuideRenderer: path.join(__dirname, 'src/styleguidist/StyleGuide'),
  },
};
