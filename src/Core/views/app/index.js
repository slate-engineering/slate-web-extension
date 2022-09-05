import * as React from "react";

import { defaultViews, viewsType } from "../";

/* -------------------------------------------------------------------------------------------------
 * useViewsState
 * -----------------------------------------------------------------------------------------------*/

export const useViewsState = () => {
  const [viewState, setViewState] = React.useState({
    feed: [],
    appliedView: defaultViews.allOpen,
    isLoadingFeed: true,
  });

  const setAppliedView = (view) => {
    setViewState((prev) => ({ ...prev, appliedView: view }));
  };

  const setViewsFeed = (result) => {
    setViewState((prev) => ({
      ...prev,
      feed: result,
    }));
  };

  const setLoadingState = (isLoading) => {
    setViewState((prev) => ({ ...prev, isLoadingFeed: isLoading }));
  };

  React.useEffect(() => {
    const { appliedView } = viewState;
    if (
      appliedView.type !== viewsType.custom &&
      appliedView.type !== viewsType.saved &&
      appliedView.type !== viewsType.files
    ) {
      setViewsFeed([]);
    }
  }, [viewState.appliedView]);

  return [
    {
      viewsFeed: viewState.feed,
      appliedView: viewState.appliedView,
      isLoadingFeed: viewState.isLoadingFeed,
      viewsType,
    },
    { setViewsFeed, setAppliedView, setLoadingState },
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
    slates: [],
    searchFeedKeys: [],
    searchFeed: null,
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
