module.exports = {
  env: {
    test: {
      plugins: ['@babel/plugin-transform-runtime'], // for async/await
    },
  },
  presets: ['@babel/preset-env', '@babel/preset-react'],
};
