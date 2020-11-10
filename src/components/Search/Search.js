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
  getRenderSectionTitle: () => () => null,
  onHighlight: () => null,
  shouldRenderSuggestions: (newValue) => newValue.trim().length > 2,
  onSelect: () => null,
  className: 'rt-search',
  inputProps: {},
};

function Search({
  apiKey,
  engines,
  getRenderSectionTitle,
  inputProps,
  onHighlight,
  shouldRenderSuggestions,
  onSelect,
  className,
}) {
  const currentEngines = useMemo(() => {
    if (!engines) {
      return {
        stops: new StopFinder(null, { apiKey }),
      };
    }
    return engines;
  }, [apiKey, engines]);

  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');

  const searchService = useMemo(
    () =>
      new SearchService({ apiKey, engines: currentEngines, setSuggestions }),
    [apiKey, engines, setSuggestions],
  );

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
            onChange: (e, { newValue }) => setValue(newValue),
            onKeyUp: ({ key }) => {
              if (key === 'Enter') {
                const filtered = suggestions.filter((s) => s.items.length > 0);
                if (filtered.length > 0) {
                  const { items, section } = filtered[0];
                  setValue(searchService.value({ ...items[0], section }));
                  onSelect({ ...items[0], section });
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
          getSectionSuggestions={({ items, section }) =>
            items ? items.map((i) => ({ ...i, section })) : []
          }
          getSuggestionValue={(suggestion) => searchService.value(suggestion)}
          onSuggestionsFetchRequested={({ value: newValue }) =>
            searchService.search(newValue)
          }
          onSuggestionsClearRequested={() => setSuggestions([])}
          onSuggestionHighlighted={({ suggestion }) => onHighlight(suggestion)}
          onSuggestionSelected={(e, { suggestion }) => onSelect(suggestion)}
          renderSuggestion={(suggestion) => searchService.render(suggestion)}
          renderSectionTitle={getRenderSectionTitle(searchService)}
          shouldRenderSuggestions={(newValue) =>
            shouldRenderSuggestions(newValue)
          }
          suggestions={suggestions}
        />
        {value && (
          <button
            type="button"
            tabIndex={0}
            className="rt-search-button rt-search-button-clear"
            onClick={() => setValue('')}
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
