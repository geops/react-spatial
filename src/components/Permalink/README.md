#

This demonstrates the use of Permalink.

```jsx
import React from 'react'
import Permalink from 'react-spatial/components/Permalink';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import Button from 'react-spatial/components/Button';
import OLMap from 'ol/Map';
import ConfigReader from '../../ConfigReader';

const layers = ConfigReader.readConfig(treeData);
const layerService = new LayerService(layers);
const map = new OLMap({ controls: [] });

const populationLayer = layerService.getLayer('USA Population Density');
const baseLayers = layerService.getBaseLayers();

<div className="tm-permalink-example">
  <BasicMap map={map} layers={layers}/>
  <Permalink
    map={map}
    layerService={layerService}
    params={{
      mode: 'custom',
    }}
    isLayerHidden={l => l.get('hideInLegend') || layerService.getParents(l).some(pl => pl.get('hideInLegend'))}
  />
  <Button
    onClick={() => {
      populationLayer.setVisible(!populationLayer.getVisible())
    }}
  >
    Toggle population layer
  </Button>
  <Button
    onClick={() => {
      if (baseLayers[1].getVisible()) {
        baseLayers[0].setVisible(true);
      } else {
        baseLayers[1].setVisible(true);
      }
    }}
  >
    Change base layer
  </Button>
</div>;
```
