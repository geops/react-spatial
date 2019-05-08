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

Run publish:

```bash
yarn version    // Increase the version number.
git push origin HEAD
yarn build
cd build
yarn publish
```

Then the new version must be published on [npmjs.com](https://www.npmjs.com/package/react-spatial).

## Publish a development version on [npmjs.com](https://www.npmjs.com/package/react-spatial)

This version WILL NOT be displayed to other in [npmjs.com](https://www.npmjs.com/package/react-spatial).

Run publish:

```bash
yarn version   // Append `-beta.0` to the current version or increase the beta number.
git push origin HEAD
yarn build
cd build
yarn publish --tag beta
```

Then the new version must be published on [npmjs.com](https://www.npmjs.com/package/react-spatial) with the tag beta.

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

## How to use SVG

Before adding an SVG file in this folder please clean it using [svgo](https://www.npmjs.com/package/svgo) or [svgomg](https://jakearchibald.github.io/svgomg/).

After optimization, verify you can use it Openlayers using this [code sandbox](https://codesandbox.io/s/5w5o4mqwlk).

Then use one of the 4 ways to load it depending on what you want:

```javascript
// Import as a React component:
import NorthArrow from 'northArrow.svg';
// Use: <NorthArrow />

// Import as an inline svg:
import northArrow from '!svg-inline-loader?noquotes!northArrow.svg';
// northArrow = "<svg xmlns='http://www.w3.org/2000/svg' height='192' ...> ... </svg>"

// Import as a base64 data URI (or with an url the file is too big):
import northArrow from '!url-loader!northArrow.svg';
// northArrow = "data:image/svg+xml;base64,PHN2ZyB4...."


// Import as an encoded inline svg data URI (or with an url the file is too big):
import northArrow from '!svg-url-loader?noquotes!northArrow.svg';
// northArrow = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='192' ...%3E ... %3C/svg%3E"
```

svg-inline-loader , svg-url-loader are npm modules add them if you need it:

```bash
yarn add svg-inline-loader svg-url-loader
```

## How to use SVG with a dynamic size

In case you want your SVG fits perfectly his parent div you need to remove `width` and `height` attributes of `<svg>` and replace it by a `viewBox` property, like this:

Replace

    `<svg width="192" height="192">`

by

    `<svg viewBox="0 0 192 192">`