/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, autocompleteClasses, styled } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { StopFinderControl } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

import StopsFinderOption from "./StopsFinderOption";

const StyledAutocomplete = styled(Autocomplete)(() => ({
  [`& .${autocompleteClasses.popupIndicatorOpen}`]: {
    transform: "rotate(0)",
  },
}));

const defaultProps = {
  textFieldProps: {},
};

function StopsFinder({
  agencies,
  apiKey,
  bbox,
  field,
  limit,
  map,
  mots,
  onSelect,
  radius,
  refLocation,
  renderAutocomplete,
  textFieldProps = defaultProps.textFieldProps,
  url,
  ...props
}) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const control = useMemo(() => {
    return new StopFinderControl({
      apiKey,
      element: document.createElement("div"),
      render(newSuggestions = { features: [] }) {
        setSuggestions(newSuggestions.features);
        setLoading(false);
      },
      target: document.createElement("div"),
      url,
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
      bbox: bbox && bbox.toString(),
      field: field && field.toString(),
      limit,
      mots: mots && mots.toString(),
      prefAgencies: agencies && agencies.toString(),
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
  return (
    <StyledAutocomplete
      autoComplete
      autoHighlight
      fullWidth
      getOptionLabel={(option) => {
        return option.properties.name;
      }}
      onChange={(evt, value, reason) => {
        if (onSelect && reason === "selectOption") {
          onSelect(value, evt);
        }
      }}
      popupIcon={<FaSearch focusable={false} size={15} />}
      renderInput={(params) => {
        return (
          <TextField
            label="Search stops"
            {...params}
            {...textFieldProps}
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
      renderOption={(liProps, option) => {
        return (
          <StopsFinderOption
            key={option.properties?.name}
            option={option}
            {...liProps}
          />
        );
      }}
      selectOnFocus
      {...props}
      inputValue={inputValue}
      loading={isLoading}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={(evt, val) => {
        setInputValue(val);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      open={isOpen}
      options={suggestions}
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
   * Properties apply to the default [MUI TextField component](https://material-ui.com/api/text-field/) used by the Autocomplete.
   */
  textFieldProps: PropTypes.object,

  /**
   * Url of the geOps StopsFinder service.
   */
  url: PropTypes.string,
};

export default StopsFinder;
