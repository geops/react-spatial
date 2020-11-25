#

This demonstrates the use of the StopFinder component.

```jsx
import React from 'react';
import { Layer } from 'mobility-toolbox-js/ol';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import BasicMap from 'react-spatial/components/BasicMap';
import StopFinder from 'react-spatial/components/StopFinder';
import { Autocomplete } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';
import {TextField} from '@material-ui/core';

const map = new Map({ controls: [] });

const layers = [
  new Layer({
    olLayer: new Tile({
      source: new OSM(),
    }),
  }),
];

// The `apiKey` used here is for demonstration purposes only.
// Please get your own api key at https://developer.geops.io/.
const { apiKey } = window;

<div className="rt-stop-finder-example">
  <BasicMap
    map={map}
    center={[951560, 6002550]}
    zoom={14}
    layers={layers}
    tabIndex={0}
  />

  <StopFinder apiKey={window.apiKey} onSelect={({geometry}) => {
    map.getView().setCenter(fromLonLat(geometry.coordinates));
  }} />


  <StopFinder apiKey={window.apiKey} renderAutocomplete={(
    suggestions,
    inputValue,
    setInputValue,
    isOpen,
    setOpen,
    isLoading,
  ) => (
    <Autocomplete
      style={{width:400}}
      options={suggestions}
      loading={isLoading}
      open={isOpen}
      inputValue={inputValue}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={(evt, val) => {
        setInputValue(val);
      }}
      getOptionLabel={(option) => option.properties.name}
      renderInput={(params) => {
        console.log(params);
        return (<TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          label="lalal"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
          }}
        />);
      }}
    />
  )} />
</div>
```
