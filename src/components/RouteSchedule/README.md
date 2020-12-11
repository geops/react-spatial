#

The following example demonstrates the use of RouteSchedule.

```jsx
import React, { useState, useEffect } from 'react';
import { Layer, TrajservLayer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import BasicMap from 'react-spatial/components/BasicMap';
import RouteSchedule from 'react-spatial/components/RouteSchedule';
import FilterButton from 'react-spatial/components/FilterButton';
import FollowButton from 'react-spatial/components/FollowButton';
import Filter from 'react-spatial/images/FilterButton/filter.svg';
import Follow from 'react-spatial/images/FollowButton/follow.svg';

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const trackerLayer = new TrajservLayer({
  apiKey: window.apiKey,
});

const layers = [
  new Layer({
    olLayer: new Tile({
      source: new OSM(),
    }),
  }),
  trackerLayer,
];

function RouteScheduleExample() {
  const [lineInfos, setLineInfos] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [followActive, setFollowActive] = useState(false);
  const [center, setCenter] = useState([951560, 6002550]);
  useEffect(()=> {
    trackerLayer.onClick((newLineInfos)=> {
      setLineInfos(newLineInfos);
    });
  }, []);

  useEffect(()=> {
    trackerLayer.map.updateSize();
  }, [lineInfos]);

  return (
    <div className="rt-route-schedule-example">
      <RouteSchedule
        lineInfos={lineInfos}
        trackerLayer={trackerLayer}
        renderHeaderButtons={routeIdentifier => (
          <>
            <FilterButton
              title="Filter"
              active={filterActive}
              onClick={active => setFilterActive(active)}
              routeIdentifier={routeIdentifier}
              trackerLayer={trackerLayer}
            >
              <Filter />
            </FilterButton>
            <FollowButton
              setCenter={setCenter}
              title="Follow"
              active={followActive}
              onClick={active => setFollowActive(active)}
              routeIdentifier={routeIdentifier}
              trackerLayer={trackerLayer}
            >
              <Follow />
            </FollowButton>
          </>
        )}
      />
      <BasicMap
        center={center}
        zoom={15}
        layers={layers}
        tabIndex={0}
      />
    </div>
  );
}

<RouteScheduleExample />;
```
