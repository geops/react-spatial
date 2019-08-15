#

This demonstrates the use of FitExtent.

```jsx
import React from 'react';
import FitExtent from 'react-spatial/components/FitExtent';
import BasicMap from 'react-spatial/components/BasicMap';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);
const extent = [-15380353.1391, 2230738.2886, -6496535.908, 6927029.2369];

function FitExtentExample() {
  return (
    <div className="tm-fitextent-example">
      <BasicMap map={map} layers={layers} />
      <FitExtent map={map} extent={extent} />
    </div>
  );
};

<FitExtentExample />;
```
