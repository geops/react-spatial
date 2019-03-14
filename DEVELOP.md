# Develop

## Create new component

Follow the [guidelines](https://github.com/geops/react-spatial/tree/master/src/components).

## Create new theme

Follow the [guidelines](https://github.com/geops/react-spatial/tree/master/src/themes).

## Documentation

We are using [react-styleguidist](https://react-styleguidist.js.org/).
Documentation and examples are available [here](https://react-spatial.geops.de/).

Build the doc:

```bash
yarn doc
```

Run the doc on [`locahost:6060`](http://locahost:6060/):

```bash
yarn start
```

## Tests

We are using [jest]([https://react-styleguidist.js.org/](https://jestjs.io/docs/en/getting-started.html)) and [enzyme]([https://github.com/airbnb/enzyme](https://airbnb.io/enzyme/)).

Run the tests in watch mode:

```bash
yarn test --watch
```

## Coverage

Run coverage:

```bash
yarn coverage
```

Then open the file `coverage/lcov-report/index.html` in your browser.

## Publish on [npmjs.com](https://www.npmjs.com/package/react-spatial)

Commit/push the new version in `package.json`.

Run publish:

```bash
yarn build
cd build
yarn publish
```

Then the new version must be published on [npmjs.com](https://www.npmjs.com/package/react-spatial).

## How to use `npm link`

If you want to use, for development purpose, this project with `npm link`:

```bash
cd react-spatial
yarn symlink
cd ../your_project
yarn link react-spatial
```

Then on every change you have to re-rerun `yarn build` or `yarn symlink`

If you project use webpack, set the [`resolve.symlinks`](https://webpack.js.org/configuration/resolve/#resolve-symlinks) options to `false`, in your webpack config file.

If you use [`create-react-app`](https://github.com/facebook/create-react-app) without ejecting, you have no choice than temporarly modify the webpack config in the `node_modules` folder.

```bash
vim react-spatial/node_modules/react-scripts/config/webpack.config.js
```

Any ideas to make this properly is welcome !!!