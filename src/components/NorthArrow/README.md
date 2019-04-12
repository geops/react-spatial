#

This demonstrates the use of NorthArrowExample (Shift + click to rotate).

```jsx
import React from 'react';
import NorthArrow from 'react-spatial/components/NorthArrow';
import BasicMap from 'react-spatial/components/BasicMap';
import Layer from 'react-spatial/Layer';
import {
  defaults as defaultInteractions,
  DragRotateAndZoom
} from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileImageSource from 'ol/source/TileImage';
import { getCenter} from 'ol/extent';
import OLMap from 'ol/Map';

class NorthArrowExample extends React.Component {
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
        extent,
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

    this.map = new OLMap({
      controls: [],
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom(),
      ]),
    });
  }

  render() {
    return (
      <div className="tm-north-arrow-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={17}
          layers={this.layers}
        />
        <NorthArrow
          className="tm-north-arrow"
          rotationOffset={20}
          map={this.map}
          circled={true}
        />
      </div>
    )
  }
}

<NorthArrowExample />;
```
