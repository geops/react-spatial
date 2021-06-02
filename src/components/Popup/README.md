
The following example demonstrates the use of Popup.

```jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Layer, MapboxLayer} from 'mobility-toolbox-js/ol';
import { Vector as VectorLayer, Tile } from 'ol/layer';
import { Map, Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Vector as VectorSource, OSM } from 'ol/source';
import TileGrid from 'ol/tilegrid/TileGrid';
import { getCenter } from 'ol/extent';
import { Style, Circle, Fill, Icon } from 'ol/style';
import BasicMap from 'react-spatial/components/BasicMap';
import Popup from 'react-spatial/components/Popup';

const map = new Map({ controls: [] });

const layers = [
  new MapboxLayer({
    url: `https://maps.geops.io/styles/base_dark_v2/style.json?key=${apiKey}`,
  }),
  new Layer({
    olLayer: new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Point([874105.13, 6106172.77]),
          }),
          new Feature({
            geometry: new Point([873105.13, 6106172.77]),
          }),
        ],
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          imgSize: [32, 48]
        }),
      }),
    }),
  }),
];


function PopupExample() {
  const [featureClicked, setFeatureClicked] = useState();

  const content = useMemo(() => {
    return featureClicked &&
    featureClicked
      .getGeometry()
      .getCoordinates()
      .toString();
  }, [featureClicked]);

  const onFeaturesClick = useCallback((features) => {
    setFeatureClicked(features.length ? features[0] : null);
  }, []);

  const onCloseClick = useCallback(()=> {
    setFeatureClicked(null);
  }, []);

  return (
    <div className="rs-popup-example">
      <BasicMap
        map={map}
        center={[874105.13, 6106172.77]}
        zoom={17}
        layers={layers}
        onFeaturesClick={onFeaturesClick}
        tabIndex={0}
      />
      <Popup
        map={map}
        header="Geometry"
        feature={featureClicked}
        onCloseClick={onCloseClick}
        panIntoView
      >
        <div>{content}</div>
      </Popup>
    </div>
  );
}

<PopupExample />;
```
