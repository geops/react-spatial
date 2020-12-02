#

The following example demonstrates the use of LayerTree.

```jsx
import React, {useEffect} from 'react';
import { MapboxLayer, MapboxStyleLayer, Layer } from 'mobility-toolbox-js/ol';
import { Style, Circle, Stroke, Fill } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSONFormat from 'ol/format/GeoJSON';
import LayerTree from 'react-spatial/components/LayerTree';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';

const baseDark = new MapboxLayer({
  url: `https://maps.geops.io/styles/base_dark_v2/style.json?key=${apiKey}`,
  name: 'Base - Dark',
  key: 'basedark.baselayer',
  isBaseLayer: true,
  visible: false,
  properties: {
    radioGroup: 'baseLayer',
  },
});

const baseBright = new MapboxLayer({
  url: `https://maps.geops.io/styles/base_bright_v2/style.json?key=${apiKey}`,
  name: 'Base - Bright',
  key: 'basebright.baselayer',
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
  },
});

const busLines = new MapboxStyleLayer({
  name: 'Bus lines',
  mapboxLayer: baseBright,
  styleLayer: {
    id: 'bus',
    type: 'line',
    source: 'busses',
    'source-layer': 'busses',
    paint: {
      'line-color': 'rgba(255, 220, 0, 1)',
      'line-width': 2,
    },
  },
});

const railLines = new MapboxStyleLayer({
  name: 'Railway lines',
  mapboxLayer: baseBright,
  styleLayer: {
    id: 'rail',
    type: 'line',
    source: 'base',
    'source-layer': 'osm_edges',
    paint: {
      'line-color': 'rgba(255, 0, 0, 1)',
      'line-width': 2,
    },
  },
});

baseBright.addChild(busLines);
baseBright.addChild(railLines);

const layers = [baseDark, baseBright];
const layerService = new LayerService(layers);

<div className="rs-layer-tree-example">
  <BasicMap layers={layers} center={[876887.69, 5928515.41]} zoom={8} tabIndex={0} />
  <LayerTree layerService={layerService} />
</div>
```