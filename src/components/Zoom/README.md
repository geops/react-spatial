#

This demonstrates the use of Zoom.

```jsx
import React from 'react';
import Zoom from 'react-spatial/components/Zoom';
import BasicMap from 'react-spatial/components/BasicMap';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);

function ZoomExample() {
  return (
    <div className="tm-zoom-example">
      <BasicMap map={map} layers={layers} />
      <Zoom map={map} zoomSlider />
    </div>
  );
};

<ZoomExample />;
```
