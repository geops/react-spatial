const path = require('path');
const { version } = require('./package.json');

module.exports = {
  title: `React-spatial ${version}`,
  require: [
    path.join(__dirname, 'src/themes/default/examples.scss'),
    'react-app-polyfill/ie11',
    'core-js',
  ],
  moduleAliases: {
    'react-spatial': path.resolve(__dirname, 'src'),
  },
  ribbon: {
    url: 'https://github.com/geops/react-spatial',
    text: 'Fork me on GitHub',
  },
  context: {
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
      description: 'A collection of react components.',
      components: 'src/components/**/[A-Z]*.js',
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
      usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
    },
  ],
  webpackConfig: {
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
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
          test: /\.svg$/,
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
      ],
    },
  },
};
