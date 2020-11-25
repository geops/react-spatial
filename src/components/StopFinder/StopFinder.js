import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import { FaSearch } from 'react-icons/fa';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import StopFinderAPI from 'mobility-toolbox-js/api/stops/StopsAPI';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => {
  return {
    popupIndicatorOpen: {
      transform: 'rotate(0)',
    },
  };
});

function StopFinder({
  apiKey,
  autocompleteProps,
  url,
  agencies,
  bbox,
  field,
  limit,
  mots,
  onSelect,
  radius,
  refLocation,
  renderAutocomplete,
}) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const api = useMemo(() => {
    return new StopFinderAPI({
      url,
      apiKey,
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
    const params = {
      q: inputValue,
      prefAgencies: agencies && agencies.toString(),
      bbox: bbox && bbox.toString(),
      field: field && field.toString(),
      limit,
      mots: mots && mots.toString(),
      radius,
      ref_location: refLocation && refLocation.toString(),
    };

    // TO REMOVE when mobility toolbox is upt to date
    Object.keys(params).forEach(
      (key) =>
        (params[key] === undefined || params[key] === null) &&
        delete params[key],
    );
    api
      .search(params, abortController)
      .then((data) => {
        if (!data) {
          // Request cancelled
          return;
        }

        // TO REMOVE when mobility toolbox is up to date
        if (data.error) {
          throw new Error(data.error);
        }
        setSuggestions(data);
        setLoading(false);
      })
      .catch(() => {
        setSuggestions([]);
        setLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, [inputValue]);

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

  return (
    <>
      <Autocomplete
        fullWidth
        autoComplete
        autoHighlight
        selectOnFocus
        getOptionLabel={(option) => option.properties.name}
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
                ...((autocompleteProps || {}).textFieldProps || {}),
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
                // eslint-disable-next-line react/jsx-props-no-spreading
                ...((autocompleteProps || {}).inputProps || {}),
              }}
            />
          );
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...autocompleteProps}
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
    </>
  );
}

StopFinder.propTypes = {
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
   * geOps api key to access the StopFinder service.
   */
  apiKey: PropTypes.string,

  /**
   * Properties apply to the default MUI Autocomplete component.
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
   * Url of the geOps StopFinder service.
   */
  url: PropTypes.string,
};

StopFinder.defaultProps = {
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

export default StopFinder;
