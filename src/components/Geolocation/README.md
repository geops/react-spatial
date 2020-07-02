#

This demonstrates the use of Geolocation.

```jsx
import React from 'react';
import OLMap from 'ol/Map';
import Geolocation from 'react-spatial/components/Geolocation';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';

const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);

function GeolocationExample() {
  return (
    <div className="rs-geolocation-example">
      <BasicMap map={map} layers={layers} tabIndex={0} />
      <Geolocation map={map} />
    </div>
  );
}

<GeolocationExample />;
```
