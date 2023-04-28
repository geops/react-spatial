
The following example demonstrates the use of Permalink.

```jsx
import React from 'react';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Circle, Stroke, Fill } from 'ol/style';
import GeoJSONFormat from 'ol/format/GeoJSON';
import { Layer, MapboxLayer } from 'mobility-toolbox-js/ol';
import Button from '@material-ui/core/Button';
import Permalink from 'react-spatial/components/Permalink';
import BasicMap from 'react-spatial/components/BasicMap';
import Map from 'ol/Map';

const map = new Map({ controls: [] });

const swissBoundries = new Layer({
  name: 'Swiss boundaries',
  key: 'swiss.boundaries',
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
  }),
  new MapboxLayer({
    url: `https://maps.geops.io/styles/base_dark_v2/style.json?key=${apiKey}`,
    name: 'Base - Dark',
    key: 'basedark.baselayer',
    visible: false,
  }),
];

const layers = [...baseLayers, swissBoundries];

<div className="rs-permalink-example">
  <BasicMap center={[876887.69, 5928515.41]} map={map} layers={layers} tabIndex={0} zoom={5} />
  <Permalink
    map={map}
    layers={layers}
    params={{
      mode: 'custom',
    }}
    isBaseLayer={l=>{
      return baseLayers.includes(l);
    }}
    isLayerHidden={l => {
        let hasParentHidden = false;
        let { parent } = l;
        while (!hasParentHidden && parent) {
          hasParentHidden = parent.get('hideInLegend');
          parent = parent.parent;
        }        
        return l.get('hideInLegend') || hasParentHidden;
    }}
  />
  <div className="rs-permalink-example-btns">
    <Button
      onClick={() => {
        swissBoundries.visible = !swissBoundries.visible;
      }}
    >
      Toggle Switzerland layer
    </Button>
    <Button
      onClick={() => {
      if (baseLayers[1].visible) {
        baseLayers[0].visible = true;
        baseLayers[1].visible = false;
      } else {
        baseLayers[0].visible = false;
        baseLayers[1].visible = true;
      }
      map.updateSize();
    }}
    >
      Change base layer
    </Button>
  </div>
</div>;
```
