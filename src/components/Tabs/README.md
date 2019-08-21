#

This demonstrates the use of Tabs

```jsx
import React, { useState } from 'react';
import OLMap from 'ol/Map';
import Layer from 'react-spatial/layers/Layer';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import Tabs from 'react-spatial/components/Tabs';
import Tab from 'react-spatial/components/Tab';
import BasicMap from 'react-spatial/components/BasicMap';

function TabsExample() {
  const [active, setActive] = useState(1);

  return (
    <div className="tm-tabs-example">
      <Tabs>
        <Tab
          key={1}
          active={active === 1}
          title="Tab 1"
          onClick={() => setActive(1)}
        >
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </p>
        </Tab>
        <Tab
          key={2}
          active={active === 2}
          title="Tab 2"
          onClick={() => setActive(2)}
        >
          <p>
            Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
            suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis
            autem vel eum iriure dolor in hendrerit in vulputate velit esse
            molestie consequat, vel illum dolore eu feugiat nulla facilisis at
            vero eros et accumsan et iusto odio dignissim qui blandit praesent
            luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
          </p>
        </Tab>
        <Tab
          key={3}
          active={active === 3}
          title="Tab 3"
          onClick={() => setActive(3)}
        >
          <p>
            Nam liber tempor cum soluta nobis eleifend option congue nihil
            imperdiet doming id quod mazim placerat facer possim assum. Lorem
            ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
            nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat.
          </p>
        </Tab>
      </Tabs>
    </div>
  );
}

<TabsExample/>;
```
