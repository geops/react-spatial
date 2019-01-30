const { version } = require('./package.json');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');

const { generateCSSReferences, generateJSReferences } = MiniHtmlWebpackPlugin;

module.exports = {
  title: `React-spatial ${version}`,
  ribbon: {
    url: 'https://github.com/geops/react-spatial',
    text: 'Fork me on GitHub',
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
          loader: 'style-loader!css-loader!sass-loader?modules',
        },
      ],
    },
  },
};
