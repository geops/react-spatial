The following example demonstrates the use of LayerTree.

This component uses the `group` property to define if the behavior will be a simple checkbox or a radio button.
If a `group` is defined, when the layer is set to visible, it will hide all other layers with the same group. Each group must be unique.

```jsx
import React  from 'react';
import { MaplibreLayer, MaplibreStyleLayer } from 'mobility-toolbox-js/ol';
import LayerTree from 'react-spatial/components/LayerTree';
import BasicMap from 'react-spatial/components/BasicMap';
import Group from 'ol/layer/Group';

const baseTravic = new MaplibreLayer({
  apiKey,
  hidden: true,
  style:'travic_v2_generalized',
});

const stations = new MaplibreStyleLayer({
  layersFilter: (layer) => {
    return layer.metadata && /mapset_stations/.test(layer.metadata['mapset.filter'])
  },
  maplibreLayer: baseTravic,
  name: 'Stations',
});

const railLines = new MaplibreStyleLayer({
  layers: [{
    id: 'rail',
    type: 'line',
    source: 'base',
    'source-layer': 'osm_edges',
    // filter: ['==', 'vehicle_type_prior', 'Zug'],
    paint: {
      'line-color': 'rgba(255, 0, 0, 1)',
      'line-width': 2,
    },
  }],
  maplibreLayer: baseTravic,
  name: 'Railways routes',
});


const group = new Group({
  children: [ baseTravic, stations, railLines],
  group: 'group',
  name: 'Travic group',
  visible: true,
});


const baseDark = new MaplibreLayer({
  apiKey,
  group: 'group',
  name: 'Base Dark V2', 
  style:'base_dark_v2',
  visible: false,
});

const layers = [baseDark, group];

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
