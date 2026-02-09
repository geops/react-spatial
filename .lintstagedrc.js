module.exports = {
  "(src|__mocks__)/**/*.js": [
    "eslint --fix",
    "prettier --write",
    "yarn test --bail --findRelatedTests",
  ],
  "package.json": ["fixpack"],
  "src/**/*.{css,scss}": ["stylelint --fix"],
};
