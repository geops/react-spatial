import {
  Autocomplete,
  autocompleteClasses,
  styled,
  TextField,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { StopsAPI } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

import StopsFinderOption from "./StopsFinderOption";

import type { TextFieldProps } from "@mui/material";

export interface StopsFinderProps {
  [key: string]: unknown;
  /**
   * Array or a comma separated list of agencies which should be available.
   * Order of these agencies chooses which agency will be preferred.
   * Available values : sbb, db
   */
  agencies?: string | string[];
  /**
   * geOps api key to access the StopsFinder service.
   */
  apiKey?: string;
  /**
   * minX,minY,maxX,maxY coordinates in WGS84 wherein the station should lie.
   */
  bbox?: number[] | string;
  /**
   * Array or a comma separated list of fields which should be used for look up.
   * Available values : id, name, coords
   */
  field?: string | string[];
  /**
   * Control how many matches will be returned.
   */
  limit?: number;
  loadingComp?: React.ReactElement;
  /**
   * Array or a comma separated list of mode of transpaorts which should be available.
   * Available values : bus, ferry, gondola, tram, rail, funicular, cable_car, subway
   */
  mots?: string | string[];
  /**
   * Function called when a suggestion is selected.
   */
  onSelect?: (value: unknown, evt: unknown) => void;
  /**
   * Radius around refLocation in meters that is most relevant.
   * Used as granularity for location rank.
   */
  radius?: number;
  /**
   * Coordinates in WGS84 (in lat,lon order) used to rank stops close to this position higher.
   * Available values : id, name, coords
   */
  refLocation?: number[] | string;
  /**
   * Function to render a different autocomplete input than the default one.
   */
  renderAutocomplete?: (...args: unknown[]) => React.ReactNode;
  /**
   * Properties apply to the default [MUI TextField component](https://material-ui.com/api/text-field/) used by the Autocomplete.
   */
  textFieldProps?: TextFieldProps;
  /**
   * Url of the geOps StopsFinder service.
   */
  url?: string;
}

const StyledAutocomplete = styled(Autocomplete)(() => {
  return {
    [`& .${autocompleteClasses.popupIndicatorOpen}`]: {
      transform: "rotate(0)",
    },
  };
});

const defaultProps = {
  loadingComp: <CircularProgress size={20} />,
  textFieldProps: {},
};

function StopsFinder({
  agencies,
  apiKey,
  bbox,
  field,
  limit,
  loadingComp = defaultProps.loadingComp,
  mots,
  onSelect,
  radius,
  refLocation,
  renderAutocomplete,
  textFieldProps = defaultProps.textFieldProps,
  url,
  ...props
}: StopsFinderProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<unknown[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const api = useMemo(() => {
    const options: unknown = { apiKey };
    if (url) {
      options.url = url;
    }
    return new StopsAPI(options);
  }, [apiKey, url]);

  useEffect(() => {
    if (!inputValue) {
      setSuggestions([]);
      setLoading(false);
      return () => {};
    }
    const abortController = new AbortController();
    setLoading(true);
    const apiParams: unknown = {
      bbox: bbox?.toString(),
      field: field?.toString(),
      limit,
      mots: mots?.toString(),
      prefAgencies: agencies?.toString(),
      q: inputValue,
      radius,
      ref_location: refLocation?.toString(),
    };
    api
      .search(apiParams, abortController)
      .then((featureCollection) => {
        setSuggestions(featureCollection?.features || []);
        setLoading(false);
      })
      .catch((error) => {
        // different from AbortError
        if (error.code !== 20) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      });
    return () => {
      abortController.abort();
    };
  }, [
    agencies,
    bbox,
    api,
    field,
    inputValue,
    limit,
    mots,
    radius,
    refLocation,
  ]);

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
    <StyledAutocomplete<{ properties: { name: string } }>
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
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                endAdornment: (
                  <>
                    {isLoading && loadingComp}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        );
      }}
      renderOption={(liProps, option) => {
        return (
          <StopsFinderOption
            key={option.properties?.name}
            loadingComp={loadingComp}
            option={option}
            {...liProps}
          />
        );
      }}
      selectOnFocus
      {...props}
      inputValue={inputValue}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={(evt: unknown, val: string) => {
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

export default React.memo(StopsFinder);
