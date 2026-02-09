module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:perfectionist/recommended-alphabetical-legacy",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["perfectionist", "prettier"],
  rules: {
    "arrow-body-style": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
      },
    ],
    "react/sort-comp": "off",
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"],
      },
    ],
    "no-restricted-exports": "Off",
    "react/forbid-prop-types": "Off",
    "prettier/prettier": "error",
    "jsx-a11y/no-access-key": "Off",
    "react/require-default-props": "Off",
  },
};
