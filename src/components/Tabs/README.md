#

This demonstrates the use of Tabs

```jsx
import React, { useState } from 'react';
import OLMap from 'ol/Map';
import Layer from 'react-spatial/Layer';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import Tabs from 'react-spatial/components/Tabs';
import TabItem from 'react-spatial/components/TabItem';
import BasicMap from 'react-spatial/components/BasicMap';


function TabsExample() {
  const [active, setActive] = useState(1);

  const map = new OLMap({ controls: [] })

  const layers = [
    new Layer({
      olLayer:new TileLayer({
        source: new OSM()
      })
    })
  ]

  const center = [836691, 6049861];

  return (
    <div className="tm-tabs-example">
        <Tabs>
          <TabItem
            key={1}
            active = {1 === active}
            title="Tab 1"
            onClick= {() => setActive(1)}
          >
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
          </TabItem>
          <TabItem
            key={2}
            active = {2 === active}
            title="Tab 2"
            onClick= {() => setActive(2)}
          >
          <BasicMap
            map={map}
            layers={layers}
            center={center}
            zoom={8}
          />
          </TabItem>
          <TabItem
            key={3}
            active = {3 === active}
            title="Tab 3"
            onClick= {() => setActive(3)}
          >
          <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. </p>
          </TabItem>
        </Tabs>
    </div>
  );
}

<TabsExample />;
```
