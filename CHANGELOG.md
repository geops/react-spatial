# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.11.3](https://github.com/geops/react-spatial/compare/v1.11.2...v1.11.3) (2024-06-28)


### Bug Fixes

* manage text style as array ([2d34873](https://github.com/geops/react-spatial/commit/2d3487326d2030e8f42b6effcbcd057bca0da852))

### [1.11.2](https://github.com/geops/react-spatial/compare/v1.11.1...v1.11.2) (2024-06-20)


### Bug Fixes

* add all line style properties  to the KML reader/writer ([ec42caf](https://github.com/geops/react-spatial/commit/ec42caf7ac60e68ff789001a62a6a13fa3a88e12))

### [1.11.1](https://github.com/geops/react-spatial/compare/v1.11.0...v1.11.1) (2024-06-13)


### Bug Fixes

* **BaseLayerSwitcher:** add onClick callback function props to BaseLayerSwitcher and Zoom ([#723](https://github.com/geops/react-spatial/issues/723)) ([dacb6f5](https://github.com/geops/react-spatial/commit/dacb6f53b358b7df1371b608e4e06f57e4db6e9f))

## [1.11.0](https://github.com/geops/react-spatial/compare/v1.10.2...v1.11.0) (2024-06-04)


### Features

* **CanvasSaveButton:** remove the html container element and only pass onClick property to its child ([#722](https://github.com/geops/react-spatial/issues/722)) ([71620fc](https://github.com/geops/react-spatial/commit/71620fcb18f7da8ef754a015cec7df6f5c3cc120))

### [1.10.2](https://github.com/geops/react-spatial/compare/v1.10.1...v1.10.2) (2024-05-28)


### Bug Fixes

* ignore scale fix if the icon has no size ([#721](https://github.com/geops/react-spatial/issues/721)) ([01d6be8](https://github.com/geops/react-spatial/commit/01d6be8ca2422e1198ee7b6fd540d22fdb314943))

### [1.10.1](https://github.com/geops/react-spatial/compare/v1.10.0...v1.10.1) (2024-05-14)


### Bug Fixes

* **CanvasSaveButton:** add maxWidth to extradata.copyright, ensure multiline updates on size change ([c58952d](https://github.com/geops/react-spatial/commit/c58952d461f1e92681c48d1a9acacf6a4b88199e))

## [1.10.0](https://github.com/geops/react-spatial/compare/v1.9.2...v1.10.0) (2024-05-14)


### Features

* write circle geometry as polygon ([#716](https://github.com/geops/react-spatial/issues/716)) ([2a40f81](https://github.com/geops/react-spatial/commit/2a40f8180fd7ffb84439c17f0c63674b82fd05d4))

### [1.9.2](https://github.com/geops/react-spatial/compare/v1.9.1...v1.9.2) (2024-03-07)


### Bug Fixes

* keep creation order of features ([50d16e9](https://github.com/geops/react-spatial/commit/50d16e91e5e852b151355b376be7a661ac4e25ca))

### [1.9.1](https://github.com/geops/react-spatial/compare/v1.9.0...v1.9.1) (2024-02-09)


### Bug Fixes

* fix search icon css ([bd46106](https://github.com/geops/react-spatial/commit/bd461060100b4314a0f53f89c289d0f44e283397))

## [1.9.0](https://github.com/geops/react-spatial/compare/v1.8.2...v1.9.0) (2024-02-09)


### Features

* update dependencies and mui@v5 ([f009da5](https://github.com/geops/react-spatial/commit/f009da502220cf6e1c1d904ca1b753e5b70503d9))


### Bug Fixes

* **LayerTree:** add LayerTree renderCheckbox prop ([#715](https://github.com/geops/react-spatial/issues/715)) ([a103897](https://github.com/geops/react-spatial/commit/a1038970a9ed236cc6bb0c6a06c0509093c41c28))
* pass the error to the onError callback ([686bf99](https://github.com/geops/react-spatial/commit/686bf996af5120c2abc0a2ffdfd2892e48eff8eb))

### [1.8.2](https://github.com/geops/react-spatial/compare/v1.8.1...v1.8.2) (2024-01-18)


### Bug Fixes

* add neverCenterToPosition property to geolocation component ([#713](https://github.com/geops/react-spatial/issues/713)) ([da1762f](https://github.com/geops/react-spatial/commit/da1762f3df5179d4012840c6ff485387b6adf86f))

### [1.8.1](https://github.com/geops/react-spatial/compare/v1.8.0...v1.8.1) (2024-01-12)


### Bug Fixes

* add renderStationName property ([0cdc7bd](https://github.com/geops/react-spatial/commit/0cdc7bd6ca638d62e0635d996c85cd5f9cb9cf8e))

## [1.8.0](https://github.com/geops/react-spatial/compare/v1.7.1...v1.8.0) (2023-12-07)


### Features

* add iconScale extended metadata in KML ([#711](https://github.com/geops/react-spatial/issues/711)) ([1b8f2f8](https://github.com/geops/react-spatial/commit/1b8f2f81b6bf8a56d861b04f0c149c4ed25998c6))

### [1.7.1](https://github.com/geops/react-spatial/compare/v1.7.0...v1.7.1) (2023-10-25)


### Bug Fixes

* hide delay in route schedule when the vehicle has no realtime ([8716ce7](https://github.com/geops/react-spatial/commit/8716ce74c8a988639a06202c8b371b647e8d03ed))

## [1.7.0](https://github.com/geops/react-spatial/compare/v1.6.0...v1.7.0) (2023-10-10)


### Features

* add renderRouterIdentifier property ([1f71d98](https://github.com/geops/react-spatial/commit/1f71d98a9021b54ebceb468817a616c9a15f6f67))

## [1.6.0](https://github.com/geops/react-spatial/compare/v1.5.7...v1.6.0) (2023-10-06)


### Features

* remove KMLFormat, remove use a ResizeHandler in BasicMap, update deps ([df436ca](https://github.com/geops/react-spatial/commit/df436ca402fba629ceb611d0c6d1603c00d3b5ff))

### [1.5.7](https://github.com/geops/react-spatial/compare/v1.5.6...v1.5.7) (2023-09-22)


### Bug Fixes

* fix time_based state management in route schedule component ([60cf0fe](https://github.com/geops/react-spatial/commit/60cf0fe9673ccb2cad5ecae7271834e54c1e6c2a))

### [1.5.6](https://github.com/geops/react-spatial/compare/v1.5.5...v1.5.6) (2023-09-20)

### Bug Fixes

* fix prop-types definition for server side rendering ([f979f735b27dcc04c7cb6589e29a2607b2585391](https://github.com/geops/react-spatial/commit/f979f735b27dcc04c7cb6589e29a2607b2585391))
  

### [1.5.5](https://github.com/geops/react-spatial/compare/v1.5.4...v1.5.5) (2023-09-20)


### Bug Fixes

* manage time_based stop in route schedule component ([117e279](https://github.com/geops/react-spatial/commit/117e2798e99d17623cc62363eb1f1800a00c0145))

### [1.5.4](https://github.com/geops/react-spatial/compare/v1.5.3...v1.5.4) (2023-08-01)


### Features

* update react 18 and clean dependencies ([9064937](https://github.com/geops/react-spatial/commit/9064937aa975f072a84b0ad82e791e79ed129c8f))

### [1.4.1](https://github.com/geops/react-spatial/compare/v1.4.0...v1.4.1) (2023-04-28)


### Bug Fixes

* use a more intuitive zooming behavior ([2d43f31](https://github.com/geops/react-spatial/commit/2d43f3189096b2195e0b550e8fb2d9d994746a8a))

## [1.4.0](https://github.com/geops/react-spatial/compare/v1.3.2...v1.4.0) (2023-01-09)


### Features

* **CanvasSaveButton:** add extraData.qrCode option to insert QR code in canvas export  ([#700](https://github.com/geops/react-spatial/issues/700)) ([16be889](https://github.com/geops/react-spatial/commit/16be889d97682c2a2d21c2fa17d55cae205e09da))

### [1.3.2](https://github.com/geops/react-spatial/compare/v1.3.1...v1.3.2) (2022-12-15)


### Bug Fixes

* fix use of baselayers permalink and baselayerswitcher ([#699](https://github.com/geops/react-spatial/issues/699)) ([23af45f](https://github.com/geops/react-spatial/commit/23af45f5681cc50cfc4c60502b71c161a478fe71))

### [1.3.1](https://github.com/geops/react-spatial/compare/v1.3.1-beta.0...v1.3.1) (2022-12-15)


### Bug Fixes

* fix detection of base layer in permalink ([9099ba7](https://github.com/geops/react-spatial/commit/9099ba704d15c670e87f8cb9245f06f159078f3e))

## [1.3.0](https://github.com/geops/react-spatial/compare/v1.3.0-beta.1...v1.3.0) (2022-11-14)


### Bug Fixes

* **LayerTree:** add input and toggle props for layer tree renderItemContent ([#697](https://github.com/geops/react-spatial/issues/697)) ([8df5237](https://github.com/geops/react-spatial/commit/8df5237482373dc9c9de1ab9cfecefaf3472dcba))

### [1.2.2](https://github.com/geops/react-spatial/compare/v1.2.1...v1.2.2) (2022-07-22)

### [1.2.1](https://github.com/geops/react-spatial/compare/v1.2.0...v1.2.1) (2022-07-22)


### Bug Fixes

* make component better work with nextjs image sand routing ([#694](https://github.com/geops/react-spatial/issues/694)) ([85871fe](https://github.com/geops/react-spatial/commit/85871fe2201ecad0de76442bc9d77815bfe6db27))

## [1.2.0](https://github.com/geops/react-spatial/compare/v1.0.35...v1.2.0) (2022-06-20)


### Features

* use standard-version and commitlint for automatic versioning and changelog ([#690](https://github.com/geops/react-spatial/issues/690)) ([2c83f00](https://github.com/geops/react-spatial/commit/2c83f00c05f5b76b3f7e38978fb022d7cebfbcfc))
