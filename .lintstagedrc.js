module.exports = {
  "(src|__mocks__)/**/!(*setupTests).js": [
    "eslint --fix",
    "prettier --write",
    "jest --bail --findRelatedTests",
  ],
  "package.json": ["fixpack"],
  "src/**/*.{css,scss}": ["stylelint --fix"],
};
