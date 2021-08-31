import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { FaSearch, FaTimes } from 'react-icons/fa';

import SearchService from './SearchService';
import StopFinder from './engines/StopFinder';

const propTypes = {
  /**
   * Flat object to provide custom search engines: key is the section and value an instance of the Engine class.
   */
  engines: PropTypes.object,

  /**
   * A function which will receive the searchService instance and needs to return a render function for the section title, see [react-autosuggest documentation](https://github.com/moroshko/react-autosuggest#render-section-title-prop) for details.
   */
  getRenderSectionTitle: PropTypes.func,

  /**
   * Initial value for the search input field.
   */
  initialValue: PropTypes.string,

  /**
   * Props for the search input field, see [react-autosuggest documentation](https://github.com/moroshko/react-autosuggest#input-props-prop) for details.
   */
  inputProps: PropTypes.object,

  /**
   * Callback function which will be called with the hovered suggestion.
   */
  onHighlight: PropTypes.func,

  /**
   * Function to define whether the suggestions are displayed or not.
   * See 'shouldRenderSuggestions' in [react-autosuggest documentation](https://github.com/moroshko/react-autosuggest#input-props-prop) for details.
   */
  shouldRenderSuggestions: PropTypes.func,

  /**
   * Callback function which will be called with the selected suggestion.
   */
  onSelect: PropTypes.func,

  /**
   * CSS class of the component.
   */
  className: PropTypes.string,

  /**
   * Key to access the engine api.
   */
  apiKey: PropTypes.string,
};

const defaultProps = {
  apiKey: null,
  engines: null,
  getRenderSectionTitle: () => {
    return () => {
      return null;
    };
  },
  initialValue: '',
  onHighlight: () => {
    return null;
  },
  shouldRenderSuggestions: (newValue) => {
    return newValue.trim().length > 2;
  },
  onSelect: () => {
    return null;
  },
  className: 'rt-search',
  inputProps: {},
};

/**
 * The Search component renders a text input field which searches for stops
 * using the input string and centers the map on the selected stop.
 */
function Search({
  apiKey,
  engines,
  getRenderSectionTitle,
  initialValue,
  inputProps,
  onHighlight,
  shouldRenderSuggestions,
  onSelect,
  className,
}) {
  const currentEngines = useMemo(() => {
    if (!engines) {
      return {
        stops: new StopFinder(undefined, { apiKey }),
      };
    }
    if (apiKey) {
      Object.values(engines).forEach((engine) => {
        if (engine.setApiKey) {
          engine.setApiKey(apiKey);
        }
      });
    }
    return engines;
  }, [apiKey, engines]);

  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState(initialValue);

  const searchService = useMemo(() => {
    return new SearchService({
      apiKey,
      engines: currentEngines,
      setSuggestions,
    });
  }, [apiKey, currentEngines]);

  const theme = useMemo(() => {
    return {
      container: `${className}__container`,
      containerOpen: `${className}__container--open`,
      input: `${className}__input`,
      inputOpen: `${className}__input--open`,
      inputFocused: `${className}__input--focused`,
      suggestionsContainer: `${className}__suggestions-container`,
      suggestionsContainerOpen: `${className}__suggestions-container--open`,
      suggestionsList: `${className}__suggestions-list`,
      suggestion: `${className}__suggestion`,
      suggestionFirst: `${className}__suggestion--first`,
      suggestionHighlighted: `${className}__suggestion--highlighted`,
      sectionContainer: `${className}__section-container`,
      sectionContainerFirst: `${className}__section-container--first`,
      sectionTitle: `${className}__section-title`,
    };
  }, [className]);

  return (
    Object.keys(currentEngines).length > 0 && (
      <div className="rt-search">
        <Autosuggest
          theme={theme}
          inputProps={{
            autoFocus: true,
            tabIndex: 0,
            onChange: (e, { newValue }) => {
              return setValue(newValue);
            },
            onKeyUp: ({ key }) => {
              if (key === 'Enter') {
                const filtered = suggestions.filter((s) => {
                  return s.items.length > 0;
                });
                if (filtered.length > 0) {
                  const { items, section } = filtered[0];
                  const targetSuggestion = { ...items[0], section };
                  setValue(searchService.value(targetSuggestion));
                  onSelect(targetSuggestion);
                }
              } else if (
                (key === 'ArrowDown' || key === 'ArrowUp') &&
                typeof searchService.highlightSection === 'function'
              ) {
                searchService.highlightSection(); // for improved accessibility
              }
            },
            value,
            ...inputProps,
          }}
          multiSection
          getSectionSuggestions={({ items, section }) => {
            return items
              ? items.map((i) => {
                  return { ...i, section };
                })
              : [];
          }}
          getSuggestionValue={(suggestion) => {
            return searchService.value(suggestion);
          }}
          onSuggestionsFetchRequested={({ value: newValue }) => {
            return searchService.search(newValue);
          }}
          onSuggestionsClearRequested={() => {
            return setSuggestions([]);
          }}
          onSuggestionHighlighted={({ suggestion }) => {
            return onHighlight(suggestion);
          }}
          onSuggestionSelected={(e, { suggestion }) => {
            return onSelect(suggestion);
          }}
          renderSuggestion={(suggestion) => {
            return searchService.render(suggestion);
          }}
          renderSectionTitle={getRenderSectionTitle(searchService)}
          shouldRenderSuggestions={(newValue) => {
            return shouldRenderSuggestions(newValue);
          }}
          suggestions={suggestions}
        />
        {value && (
          <button
            type="button"
            tabIndex={0}
            className="rt-search-button rt-search-button-clear"
            onClick={() => {
              return setValue('');
            }}
          >
            <FaTimes />
          </button>
        )}
        <button
          type="button"
          tabIndex={0}
          className="rt-search-button rt-search-button-submit"
        >
          <FaSearch focusable={false} />
        </button>
      </div>
    )
  );
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;
