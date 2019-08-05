#

This demonstrates the use of BasicMap.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import Layer from 'react-spatial/Layer';
import MapboxLayer from 'react-spatial/layers/MapboxLayer';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileImageSource from 'ol/source/TileImage';
import { getCenter} from 'ol/extent';

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
            `bern_aussenplan/${c[0]}/${c[1]}/${-c[2]-1}.png`,
          tileGrid: new TileGrid({
            origin: [extent[0], extent[1]],
            resolutions: resolutions,
          }),
        }),
      }),
    });
    this.center = getCenter(extent);
    this.layers = [
    new MapboxLayer('https://maps.style-dev.geops.io/styles/trafimage_perimeter_v2/style.json', {
      name: 'Layer',
    })];
  }

  render() {
    return <BasicMap layers={this.layers} />;
  }
}

<BasicMapExample />;
```
