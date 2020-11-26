#

This demonstrates the use of Permalink.

```jsx
import React from 'react';
import TileLayer from 'ol/layer/Tile';
import { Tile, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, OSM } from 'ol/source';
import { Style, Circle, Stroke, Fill } from 'ol/style';
import GeoJSONFormat from 'ol/format/GeoJSON';
import { Layer, MapboxLayer } from 'mobility-toolbox-js/ol';
import Permalink from 'react-spatial/components/Permalink';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import Map from 'ol/Map';
import ConfigReader from '../../ConfigReader';

const map = new Map({ controls: [] });

const swissBoundries = new Layer({
  name: 'Swiss boundries',
  key: 'swiss.boundries',
  visible: true,
  olLayer: new VectorLayer({
    source: new VectorSource({
      url: 'https://raw.githubusercontent.com/openlayers/openlayers/' +
            '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
            'switzerland.geojson',
      format: new GeoJSONFormat(),
    }),
    style: new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: '#ff0000',
        }),
      }),
      stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }),
        }),
     })
});

const baseLayers = [
  new MapboxLayer({
    url: `https://maps.geops.io/styles/base_bright_v2/style.json?key=${apiKey}`,
    name: 'Base - Bright',
    key: 'basebright.baselayer',
    isBaseLayer: true,
    visible: true,
    properties: {
      radioGroup: 'baseLayer',
    },
  }),
  new Layer({
    olLayer: new TileLayer({
      source: new OSM(),
    }),
    name: 'OSM',
    key: 'osm.baselayer',
    isBaseLayer: true,
    visible: false,
    properties: {
      radioGroup: 'baseLayer',
    },
  }),
];

const layers = [...baseLayers, swissBoundries]

const layerService = new LayerService(baseLayers);

<div className="rs-permalink-example">
  <BasicMap center={[876887.69, 5928515.41]} map={map} layers={layers} tabIndex={0} zoom={5} />
  <Permalink
    map={map}
    layerService={layerService}
    params={{
      mode: 'custom',
    }}
    isLayerHidden={l => l.get('hideInLegend') || layerService.getParents(l).some(pl => pl.get('hideInLegend'))}
  />
  <div
    role="button"
    onClick={() => {
      swissBoundries.setVisible(!swissBoundries.visible);
    }}
  >
    Toggle Switzerland layer
  </div>
  <div
    role="button"
    onClick={() => {
      if (baseLayers[1].visible) {
        baseLayers[0].setVisible(true);
      } else {
        baseLayers[1].setVisible(true);
      }
    }}
  >
    Change base layer
  </div>
</div>;
```
