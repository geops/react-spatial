# React Spatial

[![npm](https://img.shields.io/npm/v/react-spatial.svg?style=flat-square)](https://www.npmjs.com/package/react-spatial)
[![build](https://github.com/geops/react-spatial/workflows/main/badge.svg)](https://github.com/geops/react-spatial/actions?query=workflow%3Amain)
[![dependabot](https://badgen.net/dependabot/geops/react-spatial/?icon=dependabot)](https://github.com/marketplace/dependabot-preview)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Netlify Status](https://api.netlify.com/api/v1/badges/8f7b7082-8998-4e1f-9a34-4d8cd18e6003/deploy-status)](https://app.netlify.com/sites/react-spatial/deploys)

This library provides React components to build web applications based on [OpenLayers](https://openlayers.org/).

Documentation and examples at https://react-spatial.geops.de.

## Quick Start Guide

Create a new react app

```bash
npx create-react-app react-spatial-demo
```

Navigate to your `react-spatial-demo` folder and install all dependencies

```bash
yarn add ol react-spatial react-dom mapbox-gl
```

Navigate to `App.js` and import styles, `BasicMap` and `ConfigReader`

```js
import 'react-spatial/themes/default/index.scss';
import 'ol/ol.css';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
```

Add baselayer configuration below

```js
const layers = ConfigReader.readConfig([{
  name: 'OSM Baselayer',
  visible: true,
  data: {
    type: 'xyz',
    url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
}]);
```

Add `BasicMap` with `layers` prop to initialize the baselayer

```js
function App() {
  return (
    <div className="map-wrapper">
      <BasicMap layers={layers}/>
    </div>
  );
}
```

Navigate to your `App.css` and set the wrapper to absolute and give the map full height

```css
.map-wrapper {
  position: absolute
  top: 0
  right: 0
  bottom: 0
  left: 0
}
.map-wrapper .rs-map {
  height: 100%
}
```

Start your app

```bash
yarn start
```

## Getting Started

Install the [react-spatial](https://www.npmjs.com/package/react-spatial) package:

```bash
yarn add ol react-spatial
```

Your build pipeline needs to support ES6 modules and SASS.

Import the main scss file in your project:

```bash
import  'react-spatial/themes/default/index.scss';
```

## More

- [Development](https://github.com/geops/react-spatial/tree/master/DEVELOP.md)
- [Components](https://github.com/geops/react-spatial/tree/master/src/components)
- [Themes](https://github.com/geops/react-spatial/tree/master/src/themes)

## Bugs

Please use the [GitHub issue tracker](https://github.com/geops/react-spatial/issues) for all bugs and feature requests. Before creating a new issue, do a quick search to see if the problem has been reported already.
