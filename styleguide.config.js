const path = require('path');
const { version } = require('./package.json');

module.exports = {
  title: `React-spatial ${version}`,
  require: [path.join(__dirname, 'src/themes/default/examples.scss')],
  ribbon: {
    url: 'https://github.com/geops/react-spatial',
    text: 'Fork me on GitHub',
  },
  context: {
    treeData: path.join(__dirname, 'data/TreeData'),
  },
  sections: [
    {
      name: '',
      content: 'README.md',
    },
    {
      name: 'UI components',
      description: 'A collection of react components.',
      components: 'src/components/**/*.js',
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
      ],
    },
  },
};
