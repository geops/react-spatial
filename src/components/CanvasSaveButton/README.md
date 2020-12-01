#

The following example demonstrates the use of CanvasSaveButton.

```jsx
import React from 'react';
import { TiImage } from 'react-icons/ti';
import { geopsTheme, Header, Footer } from '@geops/geops-ui';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Layer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import degrees from 'radians-degrees';
import CanvasSaveButton from 'react-spatial/components/CanvasSaveButton';
import BasicMap from 'react-spatial/components/BasicMap';

const map = new Map({ controls: [] });

const layers = [
  new Layer({
    olLayer: new Tile({
      source: new OSM(),
    }),
  })
];

function CanvasSaveButtonExample() {
  return (
    <ThemeProvider theme={geopsTheme}>
      <div className="rs-canvas-save-button-example">
        <BasicMap
          map={map}
          layers={layers}
          center={[874105.13, 6106172.77]}
          zoom={10}
          tabIndex={0}
        />
        <CanvasSaveButton
          map={map}
          extraData={{
            copyright: {
              text: () => {
                return layers[0].copyright;
              },
            },
            northArrow: {
              rotation: () => {
                return degrees(map.getView().getRotation());
              },
              circled: true,
            },
          }}
        >
          <Button>
            Export Map
          </Button>
        </CanvasSaveButton>
      </div>
    </ThemeProvider>
  );
}

<CanvasSaveButtonExample />;
```
