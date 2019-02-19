# React Spatial

[![npm](https://img.shields.io/npm/v/react-spatial.svg?style=flat-square)](https://www.npmjs.com/package/react-spatial)
[![build](https://travis-ci.com/geops/react-spatial.svg?branch=master)](https://travis-ci.com/geops/react-spatial)
[![Greenkeeper badge](https://badges.greenkeeper.io/geops/react-spatial.svg)](https://greenkeeper.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This library provides React components to build web applications based on [OpenLayers](https://openlayers.org/).

## Getting Started

Install the [react-spatial package](https://www.npmjs.com/package/react-spatial):

```bash
yarn add ol react-spatial
```

Your build pipeline needs to support ES6 modules and SASS.

## Documentation

Documentation and examples are available [here](https://react-spatial.geops.de/).
For a local version, run `yarn doc:server` then open [`http://locahost:6060/`](http://locahost:6060/).

## If you want to know more about

- [Components](https://github.com/geops/react-spatial/tree/master/src/components)
- [Themes](https://github.com/geops/react-spatial/tree/master/src/themes)

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

If you use [`create-ract-app`](https://github.com/facebook/create-react-app) without ejecting, you have no choice than temporarly modify the webpack config in the `node_modules` folder.

```bash
vim react-spatial/node_modules/react-scripts/config/webpack.config.js
```

Any ideas to make this properly is welcome !!!

## Bugs

Please use the [GitHub issue tracker](https://github.com/geops/react-spatial/issues) for all bugs and feature requests. Before creating a new issue, do a quick search to see if the problem has been reported already.
