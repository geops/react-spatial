
The following example demonstrates the use of RouteSchedule.

```jsx
import React, { useState, useEffect } from 'react';
import { RealtimeLayer } from 'mobility-toolbox-js/ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { unByKey } from 'ol/Observable';
import BasicMap from 'react-spatial/components/BasicMap';
import RouteSchedule from 'react-spatial/components/RouteSchedule';
import { ToggleButton } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import { GpsFixed as GpsFixedIcon } from '@mui/icons-material';


// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const trackerLayer = new RealtimeLayer({
  apiKey: window.apiKey,
});

const layers = [
  new Tile({
    source: new OSM(),
  }),
  trackerLayer,
];

let updateInterval;


const getVehicleCoord = (routeIdentifier) => {
  const [trajectory] = trackerLayer.getVehicle((traj) => {
    return traj.properties.route_identifier === routeIdentifier;
  });
  return trajectory && trajectory.properties.coordinate;
};

function RouteScheduleExample() {
  const [lineInfos, setLineInfos] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [followActive, setFollowActive] = useState(false);
  const [center, setCenter] = useState([951560, 6002550]);
  const [feature, setFeature] = useState();

  useEffect(()=> {
    let vehicleId = null;
    if (feature) {
      vehicleId = feature.get('train_id');
      trackerLayer.api.subscribeStopSequence(vehicleId, ({ content: [stopSequence] }) => {
        if (stopSequence) {
          setLineInfos(stopSequence);
        }
      });
    } else {
      setLineInfos();
    }
  return ()=> {
    if (vehicleId){
      trackerLayer.api.unsubscribeStopSequence(vehicleId);
    }
  }
  }, [feature]);

  useEffect(()=> {
    const map = trackerLayer.map;
    if (!map) {
      return ()=>{};
    }
    const key = map.on('singleclick', (evt) => {
      console.log('ici');
      const [feature] = map.getFeaturesAtPixel(evt.pixel, {
        layerFilter: l => l === trackerLayer,
        hitTolerance: 5
      }) || [];
      console.log(feature);
      setFeature(feature);
    });
    return () => {
      unByKey(key);
    }
  }, [trackerLayer.map]);

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
            <ToggleButton 
              value="filter"
              selected={filterActive}
              onClick={() => {              
                if (!filterActive) {                
                  trackerLayer.filter = (trajectory) => {
                    return trajectory.properties.route_identifier === routeIdentifier;
                  };
                } else {
                  trackerLayer.filter = null;
                }
                setFilterActive(!filterActive);
              }}>
              <FaFilter />              
            </ToggleButton>
            <ToggleButton 
              value="follow"
              selected={followActive}
              onClick={() => {            
                clearInterval(updateInterval);
                if (!followActive) {
                  updateInterval = window.setInterval(() => {        
                    const coord = getVehicleCoord(routeIdentifier);
                    if (coord) {
                      setCenter(coord);
                    }
                  }, 50);
                }
                setFollowActive(!followActive);
              }}>
              <GpsFixedIcon />              
            </ToggleButton>
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
