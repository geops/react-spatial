#

This demonstrates the use of BasicMap.

```jsx
const React = require('react');
const BasicMap = require('./BasicMap').default;
const Layer = require('../../Layer').default;
const TileLayer = require('ol/layer/Tile').default;
const TileGrid = require('ol/tilegrid/TileGrid').default;
const TileImageSource = require('ol/source/TileImage').default;
const getCenter = require('ol/extent').getCenter;
require('./BasicMap.md.css');

class BasicMapExample extends React.Component {
  constructor(props) {
    super(props);

    const extent = [599500, 199309, 600714, 200002];
    const resolutions = [
      6.927661,
      3.4638305,
      1.73191525,
      0.865957625,
      0.4329788125,
      0.21648940625,
      0.108244703125,
    ];

    const layer = new Layer({
      name: 'Layer',
      olLayer: new TileLayer({
        extent: extent,
        source: new TileImageSource({
          tileUrlFunction: c =>
            '//plans.trafimage.ch/static/tiles/' +
            `bern_aussenplan/${c[0]}/${c[1]}/${c[2]}.png`,
          tileGrid: new TileGrid({
            origin: [extent[0], extent[1]],
            resolutions: resolutions,
          }),
        }),
      }),
    });
    this.center = getCenter(extent);
    this.layers = [layer];
  }

  render() {
    return <BasicMap center={this.center} layers={this.layers} />;
  }
}

<BasicMapExample />;
```
