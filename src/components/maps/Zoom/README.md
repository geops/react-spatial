#

This demonstrates the use of Zoom.

```jsx
import React from 'react';
import Zoom from 'react-spatial/components/maps/Zoom';
import BasicMap from 'react-spatial/components/maps/BasicMap';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);

function ZoomExample() {
  return (
    <div className="rs-zoom-example">
      <BasicMap map={map} layers={layers} tabIndex={0} />
      <Zoom map={map} zoomSlider />
    </div>
  );
};

<ZoomExample />;
```
