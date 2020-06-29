#

This demonstrates the use of FitExtent.

```jsx
import React from 'react';
import FitExtent from 'react-spatial/components/maps/FitExtent';
import BasicMap from 'react-spatial/components/maps/BasicMap';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

const map = new OLMap({ controls: [] });
const layers = ConfigReader.readConfig(treeData);
const extent = [-15380353.1391, 2230738.2886, -6496535.908, 6927029.2369];

function FitExtentExample() {
  return (
    <div>
      <BasicMap map={map} layers={layers} tabIndex={0} />
      <FitExtent map={map} extent={extent}>fit!</FitExtent>
    </div>
  );
};

<FitExtentExample />;
```
