import { isNewTab } from "~/common/utilities";
import * as React from "react";

import { defaultViews, viewsType } from "../";

/* -------------------------------------------------------------------------------------------------
 * useViewsState
 * -----------------------------------------------------------------------------------------------*/

export const useViewsState = () => {
  const [viewState, setViewState] = React.useState({
    feed: [],
    feedKeys: null,
    appliedView: isNewTab ? defaultViews.saved : defaultViews.allOpen,
    isLoadingFeed: true,
  });

  const setViewsStateSafely = React.useCallback(
    ({ feed, feedKeys, isLoadingFeed, appliedView }) => {
      const newState = {};
      if (appliedView) {
        newState["appliedView"] = appliedView;
      }
      if (typeof isLoadingFeed === "boolean") {
        newState["isLoadingFeed"] = isLoadingFeed;
      }
      if (feed) {
        newState["feed"] = feed;
      }

      if (typeof feedKeys !== "undefined") {
        newState["feedKeys"] = feedKeys;
      }

      setViewState((prev) => ({
        ...prev,
        ...newState,
      }));
    },
    []
  );

  React.useEffect(() => {
    const { appliedView } = viewState;
    if (
      appliedView.type !== viewsType.custom &&
      appliedView.type !== viewsType.saved &&
      appliedView.type !== viewsType.files
    ) {
      setViewsStateSafely({ feed: [], feedKeys: null });
    }
  }, [setViewsStateSafely, viewState.appliedView.type]);

  return [
    {
      viewsFeed: viewState.feed,
      viewsFeedKeys: viewState.feedKeys,
      appliedView: viewState.appliedView,
      isLoadingFeed: viewState.isLoadingFeed,
      viewsType,
    },
    setViewsStateSafely,
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

const SEARCH_INITIAL_STATE = {
  query: "",
  slates: [],
  searchFeedKeys: [],
  searchFeed: null,
};

export const useHistorySearchState = ({ inputRef, onSearch }) => {
  const [search, setSearch] = React.useState(SEARCH_INITIAL_STATE);

  const clearSearch = React.useCallback(
    () => setSearch(SEARCH_INITIAL_STATE),
    []
  );

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
