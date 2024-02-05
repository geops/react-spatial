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

const baseTravic = new MapboxLayer({
  name: 'Base - Bright',
  group: 'baseLayer',
  url: `https://maps.geops.io/styles/travic_v2_generalized/style.json?key=${apiKey}`,
});

const stations = new MapboxStyleLayer({
  name: 'Stations',
  mapboxLayer: baseTravic,
  styleLayersFilter: (layer) => {
    return layer.metadata && /mapset_stations/.test(layer.metadata['mapset.filter'])
  }
});

const railLines = new MapboxStyleLayer({
  name: 'Railways routes',
  mapboxLayer: baseTravic,
  styleLayer: {
    id: 'rail',
    type: 'line',
    source: 'base',
    'source-layer': 'osm_edges',
    filter: ['==', 'vehicle_type_prior', 'Zug'],
    paint: {
      'line-color': 'rgba(255, 0, 0, 1)',
      'line-width': 2,
    },
  },
});


baseTravic.children = [railLines, stations];

const baseDark = new MapboxLayer({
  name: 'Base - Dark',
  group: 'baseLayer',
  visible: false,
  url: `https://maps.geops.io/styles/base_dark_v2/style.json?key=${apiKey}`,
});

const layers = [baseDark, baseTravic];

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
