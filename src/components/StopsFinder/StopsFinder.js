import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import { FaSearch } from 'react-icons/fa';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StopFinderControl } from 'mobility-toolbox-js/ol';
import { Map } from 'ol';
import { makeStyles } from '@material-ui/core';
import StopsFinderOptions from './StopsFinderOption';

const useStyles = makeStyles(() => {
  return {
    popupIndicatorOpen: {
      transform: 'rotate(0)',
    },
  };
});

function StopsFinder({
  agencies,
  apiKey,
  autocompleteProps,
  bbox,
  field,
  limit,
  map,
  mots,
  onSelect,
  radius,
  refLocation,
  renderAutocomplete,
  url,
}) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const control = useMemo(() => {
    return new StopFinderControl({
      url,
      apiKey,
      target: document.createElement('div'),
      element: document.createElement('div'),
      render(newSuggestions = { features: [] }) {
        setSuggestions(newSuggestions.features);
        setLoading(false);
      },
    });
  }, [apiKey, url]);

  useEffect(() => {
    if (!inputValue) {
      setSuggestions([]);
      setLoading(false);
      return () => {};
    }
    const abortController = new AbortController();
    setLoading(true);
    control.apiParams = {
      prefAgencies: agencies && agencies.toString(),
      bbox: bbox && bbox.toString(),
      field: field && field.toString(),
      limit,
      mots: mots && mots.toString(),
      radius,
      ref_location: refLocation && refLocation.toString(),
    };
    control.search(inputValue, abortController);
    return () => {
      abortController.abort();
    };
  }, [
    agencies,
    bbox,
    control,
    field,
    inputValue,
    limit,
    mots,
    radius,
    refLocation,
  ]);

  // Ensure the control is not associated to the wrong map
  useEffect(() => {
    if (!control) {
      return () => {};
    }

    control.map = map;

    return () => {
      control.map = null;
    };
  }, [map, control]);

  if (!control) {
    return null;
  }

  if (renderAutocomplete) {
    return renderAutocomplete(
      suggestions,
      inputValue,
      setInputValue,
      isOpen,
      setOpen,
      isLoading,
      setLoading,
    );
  }
  const textFieldProps = {
    ...((autocompleteProps || {}).textFieldProps || {}),
  };
  const autocProps = { ...autocompleteProps };
  delete autocProps.textFieldProps;

  return (
    <Autocomplete
      fullWidth
      autoComplete
      autoHighlight
      selectOnFocus
      getOptionLabel={(option) => {
        return option.properties.name;
      }}
      onChange={(evt, value, reason) => {
        if (onSelect && reason === 'select-option') {
          onSelect(value, evt);
        }
      }}
      popupIcon={<FaSearch focusable={false} size={15} />}
      renderInput={(params) => {
        return (
          <TextField
            label="Search stops"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...{
              ...params,
              ...textFieldProps,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading && <CircularProgress size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        );
      }}
      renderOption={(option) => {
        return <StopsFinderOptions option={option} />;
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...autocProps}
      classes={{ ...classes, ...autocompleteProps.classes }}
      inputValue={inputValue}
      open={isOpen}
      options={suggestions}
      loading={isLoading}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={(evt, val) => {
        setInputValue(val);
      }}
    />
  );
}

StopsFinder.propTypes = {
  /**
   * Array or a comma separated list of agencies which should be available.
   * Order of these agencies chooses which agency will be preferred.
   * Available values : sbb, db
   */
  agencies: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  /**
   * geOps api key to access the StopsFinder service.
   */
  apiKey: PropTypes.string,

  /**
   * Properties apply to the default [MUI Autocomplete component](https://material-ui.com/api/autocomplete/).
   * We add a custom properties textFieldProps for the default [MUI TextField component](https://material-ui.com/api/text-field/) used by the Autocomplete.
   */
  autocompleteProps: PropTypes.object,

  /**
   * minX,minY,maxX,maxY coordinates in WGS84 wherein the station should lie.
   */
  bbox: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number),
  ]),

  /**
   * Array or a comma separated list of fields which should be used for look up.
   * Available values : id, name, coords
   */
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  /**
   * Control how many matches will be returned.
   */
  limit: PropTypes.number,

  /**
   * A map.
   */
  map: PropTypes.instanceOf(Map).isRequired,

  /**
   * Array or a comma separated list of mode of transpaorts which should be available.
   * Available values : bus, ferry, gondola, tram, rail, funicular, cable_car, subway
   */
  mots: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  /**
   * Function called when a suggestion is selected.
   */
  onSelect: PropTypes.func,

  /**
   * Radius around refLocation in meters that is most relevant.
   * Used as granularity for location rank.
   */
  radius: PropTypes.number,

  /**
   * Coordinates in WGS84 (in lat,lon order) used to rank stops close to this position higher.
   * Available values : id, name, coords
   */
  refLocation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number),
  ]),

  /**
   * Function to render a different autocomplete input than the default one.
   */
  renderAutocomplete: PropTypes.func,

  /**
   * Url of the geOps StopsFinder service.
   */
  url: PropTypes.string,
};

StopsFinder.defaultProps = {
  agencies: null,
  apiKey: null,
  autocompleteProps: {},
  bbox: null,
  field: null,
  limit: null,
  mots: null,
  onSelect: null,
  radius: null,
  refLocation: null,
  url: null,
  renderAutocomplete: null,
};

export default StopsFinder;
