module.exports = {
  // Always lint & format source files
  "(src|__mocks__)/**/*.js": ["eslint --fix", "prettier --write"],

  // Only run Jest when actual test files are staged
  "(src|__mocks__)/**/*.{test,spec}.js": ["jest --bail --findRelatedTests"],

  "package.json": ["fixpack"],
  "src/**/*.{css,scss}": ["stylelint --fix"],
};
