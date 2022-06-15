import * as React from "react";

import { viewsType } from "../";

/* -------------------------------------------------------------------------------------------------
 * useViewsState
 * -----------------------------------------------------------------------------------------------*/

export const useViewsState = () => {
  const [views, setViewsState] = React.useState({
    feed: [],
    type: viewsType.currentWindow,
    query: undefined,
  });

  const setViewsParams = ({ type, query }) => {
    setViewsState((prev) => ({ ...prev, type, query }));
  };

  const setViewsFeed = (result) => {
    setViewsState((prev) => ({
      ...prev,
      feed: result,
    }));
  };

  return [
    {
      viewsFeed: views.feed,
      currentView: views.type,
      currentViewQuery: views.query,
      viewsType,
    },
    { setViewsFeed, setViewsParams },
  ];
};

/* -------------------------------------------------------------------------------------------------
 * useHistorySearchState
 * -----------------------------------------------------------------------------------------------*/

const useDebouncedOnChange = ({ setQuery, handleSearch }) => {
  const timeRef = React.useRef();
  const handleChange = (e) => {
    clearTimeout(timeRef.current);
    const { value } = e.target;
    timeRef.current = setTimeout(
      () => (setQuery(value), handleSearch(value)),
      300
    );
  };
  return handleChange;
};

export const useHistorySearchState = ({ inputRef, onSearch }) => {
  const SEARCH_INITIAL_STATE = {
    query: "",
    result: null,
  };
  const [search, setSearch] = React.useState(SEARCH_INITIAL_STATE);

  const clearSearch = () => setSearch(SEARCH_INITIAL_STATE);

  const handleInputChange = useDebouncedOnChange({
    setQuery: (query) => setSearch((prev) => ({ ...prev, query })),
    handleSearch: onSearch,
  });

  React.useEffect(() => {
    if (search.query.length === 0) {
      setSearch(SEARCH_INITIAL_STATE);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [search.query]);

  return [
    { search, initialState: SEARCH_INITIAL_STATE },
    { handleInputChange, setSearch, clearSearch },
  ];
};
