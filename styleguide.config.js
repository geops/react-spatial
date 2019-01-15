
module.exports = {
  webpackConfig: {
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        // Load css and scss files.
        {
          test: /\.s?css$/,
          loader: 'style-loader!css-loader!sass-loader?modules',
        },
      ]
    }
  }
}