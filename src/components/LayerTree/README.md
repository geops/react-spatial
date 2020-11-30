#

The following example demonstrates the use of LayerTree.

```jsx
import React from 'react';
import { MapboxLayer, Layer } from 'mobility-toolbox-js/ol';
import { Style, Circle, Stroke, Fill } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSONFormat from 'ol/format/GeoJSON';
import LayerTree from 'react-spatial/components/LayerTree';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';

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
  new MapboxLayer({
    url: `https://maps.geops.io/styles/base_dark_v2/style.json?key=${apiKey}`,
    name: 'Base - Dark',
    key: 'basedark.baselayer',
    isBaseLayer: true,
    visible: false,
    properties: {
      radioGroup: 'baseLayer',
    },
  }),
];

const vectorLayers = [
  new Layer({
    name: 'Vector sample layers',
    key: 'vector.sample.layers',
    visible: true,
    children: [
      new Layer({
        name: 'Countries',
        key: 'countries',
        properties: {
          radioGroup: 'radio',
        },
        children: [
          new Layer({
            name: 'Countries Borders',
            key: 'country.borders',
            visible: false,
            olLayer: new VectorLayer({
              source: new VectorSource({
                url: 'https://openlayers.org/en/latest/examples/data/geojson/' +
                'countries.geojson',
                format: new GeoJSONFormat(),
              }),
            }),
          }),
          new Layer({
            name: 'Switzerland',
            key: 'switzerland.samples',
            olLayer: new VectorLayer({
              source: new VectorSource({
                url: 'https://raw.githubusercontent.com/openlayers/openlayers/' +
                  '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
                  'switzerland.geojson',
                format: new GeoJSONFormat(),
              }),
              style: new Style({
                fill: new Fill({
                  color: [255, 0, 0, 0.5],
                }),
              }),
            }),
          }),
        ]
      }),
      new Layer({
        name: 'Vienna Streets',
        key: 'vienna.streets',
        properties: {
          radioGroup: 'radio',
        },
        olLayer: new VectorLayer({
          source: new VectorSource({
            url: 'https://raw.githubusercontent.com/openlayers/openlayers/' +
                '3c64018b3754cf605ea19cbbe4c8813304da2539/examples/data/geojson/' +
                'vienna-streets.geojson',
            format: new GeoJSONFormat(),
          }),
          style: new Style({
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2,
            }),
          }),
        }),
      }),
    ]
  }),
];

const layers = [...baseLayers, ...vectorLayers];
const layerService = new LayerService(layers);
console.log(layerService.getLayer('Countries Borders'));

<div className="rs-layer-tree-example">
  <BasicMap layers={layers} center={[876887.69, 5928515.41]} zoom={3} tabIndex={0} />
  <LayerTree layerService={layerService} />
</div>
```
