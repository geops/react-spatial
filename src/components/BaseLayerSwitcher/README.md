#

This demonstrates the use of BaseLayerSwitcher.

```jsx
import React from 'react';
import OLMap from 'ol/Map';
import BaseLayerSwitcher from 'react-spatial/components/BaseLayerSwitcher';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import ConfigReader from 'react-spatial/ConfigReader';
import OSM_image from '../../images/baselayer/osm.baselayer.png';
import OSMhot_image from '../../images/baselayer/osm.baselayer.hot.png';
import PoenTopo_image from '../../images/baselayer/open.topo.map.png';

const center = [1149722.7037660484, 6618091.313553318];
const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);
const layerService = new LayerService(layers);
const layerImages = {
  osm: OSM_image,
  osm_hot: OSMhot_image,
  opentopo: PoenTopo_image,
};

<div className="rs-base-layer-example">
  <BasicMap
    map={map}
    center={center}
    zoom={6}
    layers={layers}
  />
  <BaseLayerSwitcher
    layers={layers}
    layerImages={layerImages}
  />
</div>;
```
