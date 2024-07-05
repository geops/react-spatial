
The following example demonstrates the use of Permalink.

The Peramlink component add the following parameters to the url:

- `x`,`y`,`z`: The center and zoom of the map.
- `layers`: The visible layers of the map.
- `baselayers`: List of all base layers of the map. The first one is currently visible.

`layers` and `baselayers` uses by default the `key` property of the layers. This key must be unique.

Which layers appears in `baselayers` or `layers` are defined by the `isBaseLayer` attribute of the component.

```jsx
import React from 'react';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Circle, Stroke, Fill } from 'ol/style';
import GeoJSONFormat from 'ol/format/GeoJSON';
import { geopsTheme } from '@geops/geops-ui';
import { ThemeProvider } from '@mui/material';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';
import Button from '@mui/material/Button';
import Permalink from 'react-spatial/components/Permalink';
import BasicMap from 'react-spatial/components/BasicMap';
import Map from 'ol/Map';

const map = new Map({ controls: [] });

const swissBoundries = new VectorLayer({
  name: 'Swiss boundaries',
  key: 'swiss.boundaries',
  visible: true,
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
});

const baseLayers = [
  new MaplibreLayer({
    key: 'basebright.baselayer',
    name: 'Base - Bright',
    mapLibreOptions: {
      style: `https://maps.geops.io/styles/base_bright_v2/style.json?key=${apiKey}`,
    },
  }),
  new MaplibreLayer({
    key: 'basedark.baselayer',
    name: 'Base - Dark',
    mapLibreOptions: {
      style: `https://maps.geops.io/styles/base_dark_v2/style.json?key=${apiKey}`,
    },
    visible: false,
  }),
];

const layers = [...baseLayers, swissBoundries];

<ThemeProvider theme={geopsTheme}>
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
          swissBoundries.setVisible(!swissBoundries.getVisible());
        }}
      >
        Toggle Switzerland layer
      </Button>
      <Button
        onClick={() => {
        if (baseLayers[1].getVisible()) {
          baseLayers[0].setVisible(true);
          baseLayers[1].setVisible(false);
        } else {
          baseLayers[0].setVisible(false);
          baseLayers[1].setVisible(true);
        }
        map.updateSize();
      }}
      >
        Change base layer
      </Button>
    </div>
  </div>
</ThemeProvider>
```
