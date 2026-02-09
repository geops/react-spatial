
The following example demonstrates the use of Popup.

```jsx
import React, { useState, useMemo, useCallback } from 'react';
import { MaplibreLayer} from 'mobility-toolbox-js/ol';
import VectorLayer from 'ol/layer/Vector';
import { Map, Feature } from 'ol';
import Point from 'ol/geom/Point';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { getCenter } from 'ol/extent';
import { Style, Circle, Fill, Icon } from 'ol/style';
import BasicMap from 'react-spatial/components/BasicMap';
import Popup from 'react-spatial/components/Popup';

const map = new Map({ controls: [] });

const layers = [
  new MaplibreLayer({
    apiKey: apiKey,
  }),
  new VectorLayer({
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
        size: [32, 48]
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
