The following example demonstrates the use of LayerTree.

```jsx
import React, { useEffect } from 'react';
import { MapboxLayer, MapboxStyleLayer, Layer } from 'mobility-toolbox-js/ol';
import { Style, Circle, Stroke, Fill } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSONFormat from 'ol/format/GeoJSON';
import LayerTree from 'react-spatial/components/LayerTree';
import BasicMap from 'react-spatial/components/BasicMap';


const baseBright = new MapboxLayer({
  name: 'Base - Bright',
  group: 'baseLayer',
  url: `https://maps.geops.io/styles/base_bright_v2/style.json?key=${apiKey}`,
});

const busLines = new MapboxStyleLayer({
  name: 'Tramway routes',
  mapboxLayer: baseBright,
  visible: false,
  styleLayer: {
    id: 'bus',
    type: 'line',
    source: 'base',
    'source-layer': 'osm_edges',
    filter: ['==', 'vehicle_type_prior', 'Tram' ],
    paint: {
      'line-color': 'rgba(255, 220, 0, 1)',
      'line-width': 3,
    },
  },
});

const railLines = new MapboxStyleLayer({
  name: 'Railways routes',
  mapboxLayer: baseBright,
  styleLayer: {
    id: 'rail',
    type: 'line',
    source: 'base',
    'source-layer': 'osm_edges',
    filter: ['==', 'vehicle_type_prior', 'Zug' ],
    paint: {
      'line-color': 'rgba(255, 0, 0, 1)',
      'line-width': 2,
    },
  },
});

const passengerFrequencies = new MapboxStyleLayer({
  name: 'Passenger frequencies',
  mapboxLayer: baseBright,
  styleLayer: {
    id: 'passagierfrequenzen',
    type: 'circle',
    source: 'base',
    'source-layer': 'osm_points',
    filter: ['has', 'dwv'],
    paint: {
      'circle-radius': ['*', ['sqrt', ['/', ['get', 'dwv'], Math.PI]], 0.2],
      'circle-color': 'rgb(254, 160, 0)',
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgb(254, 160, 0)',
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.7,
      ],
    },
  },
});

// const baseBrightGroup = new Layer ({
//   name: 'Base - Bright',
//   group: 'baseLayer',
//   children: [baseBright, passengerFrequencies, railLines, busLines],
// })
baseBright.children = [passengerFrequencies, railLines, busLines];

const baseDark = new MapboxLayer({
  name: 'Base - Dark',
  group: 'baseLayer',
  visible: false,
  url: `https://maps.geops.io/styles/base_dark_v2/style.json?key=${apiKey}`,
});

const baseTravic = new MapboxLayer({
  url: `https://maps.geops.io/styles/travic_v2/style.json?key=${apiKey}`,
  group: 'baseLayer',
  visible: false,
  properties: {
    hidden: true,
  },
});

const layers = [ baseDark, baseTravic, baseBright ];

<div className="rs-layer-tree-example">
  <BasicMap
    layers={layers}
    center={[876887.69, 5928515.41]}
    zoom={8}
    tabIndex={0}
  />
  <LayerTree
    layers={layers}
    isItemHidden={(layer) => layer.get('hidden')}
    expandChildren
  />
</div>;
```
