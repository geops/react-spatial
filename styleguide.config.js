const path = require('path');
const { version } = require('./package.json');

module.exports = {
  version,
  template: {
    favicon: 'images/favicon.png',
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Lato:400,700',
        },
      ],
    },
  },
  assetsDir: 'src/',
  styleguideDir: 'styleguide-build',
  require: [
    path.join(__dirname, 'src/themes/default/examples.scss'),
    path.join(__dirname, 'src/styleguidist/styleguidist.css'),
    'ol/ol.css',
    'react-app-polyfill/ie11',
    'react-app-polyfill/stable',
    'abortcontroller-polyfill/dist/abortcontroller-polyfill-only',
  ],
  moduleAliases: {
    'react-spatial': path.resolve(__dirname, 'src'),
  },
  sections: [
    {
      name: '',

      content: 'README.md',
    },
    {
      name: 'Maps',
      description:
        'A collection of React components for spatial web development of map components.',
      components: [
        'src/components/BaseLayerSwitcher/[A-Z]*.js',
        'src/components/BaseLayerToggler/[A-Z]*.js',
        'src/components/BasicMap/[A-Z]*.js',
        'src/components/CanvasSaveButton/[A-Z]*.js',
        'src/components/Copyright/[A-Z]*.js',
        'src/components/FeatureExportButton/[A-Z]*.js',
        'src/components/FitExtent/[A-Z]*.js',
        'src/components/Geolocation/[A-Z]*.js',
        'src/components/LayerTree/[A-Z]*.js',
        'src/components/MousePosition/[A-Z]*.js',
        'src/components/NorthArrow/[A-Z]*.js',
        'src/components/Permalink/[A-Z]*.js',
        'src/components/Popup/[A-Z]*.js',
        'src/components/Overlay/[A-Z]*.js',
        'src/components/ScaleLine/[A-Z]*.js',
        'src/components/Zoom/[A-Z]*.js',
      ],
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
    },
    {
      name: 'Realtime',
      description:
        'A collection of React components for spatial web development of realtime components.',
      components: [
        'src/components/RouteSchedule/[A-Z]*.js',
        'src/components/TrackerControl/[A-Z]*.js',
      ],
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
    },
    {
      name: 'Stops',
      description:
        'A collection of React components for spatial web development of stops components.',
      components: [
        'src/components/StopsFinder/StopsFinder.js',
        'src/components/Search/Search.js',
      ],
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
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
            /\/node_modules\/(split-on-first|react-dev-utils|ansi-styles|jsts|estree-walker|strip-ansi|mobility-toolbox-js)/,
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
          exclude: [
            path.resolve(__dirname, 'node_modules', '@geops', 'geops-ui'),
          ],
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
          test: /^((?!url).)*\.svg$/,
          include: [
            path.resolve(__dirname, 'node_modules', '@geops', 'geops-ui'), // Load geops-ui SVGs using file-loader
          ],
          use: [
            {
              loader: 'file-loader',
              options: {
                jsx: true,
              },
            },
          ],
        },
        {
          test: /\.url\.svg$/,
          loader: 'url-loader',
        },
        {
          test: /\.png$|.ico$/,
          use: [
            {
              loader: 'url-loader',
            },
          ],
        },
      ],
    },
  },
  theme: {
    color: {
      links: '#6987a1',
      linkHover: '#76B833',
    },
    fontFamily: {
      base: 'Lato, Arial, sans-serif',
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
